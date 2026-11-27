import { describe, expect, it, vi } from 'vitest';
import {
  BACKUP_SCHEMA_VERSION,
  backupFileName,
  backupReminder,
  buildBackup,
  mergeAction,
  parseBackup,
  planMerge,
  summarizeBackup,
} from '../backup';
import { deliverBackupFile } from '../backupStore';
import { Exercise, Program, WorkoutLog } from '../../../types/models';

const exercise: Exercise = { id: 'custom-1', name: 'Custom Curl', isCustom: true };
const program: Program = {
  id: 'five-day-40plus',
  name: '5-Day',
  exercises: [],
  days: [{ id: 'day1', name: 'Upper', exercises: [{ exerciseId: 'bench-press', targetSets: 3, targetReps: '8-10', targetRir: 3 }] }],
};
const workout = (id: string, date: string, rir?: number): WorkoutLog => ({
  id,
  date: new Date(date),
  loggedExercises: [{ exerciseId: 'bench-press', sets: [{ weight: 40, reps: 8, rir, isFailure: false }] }],
});

function sampleBackup(overrides?: Partial<ReturnType<typeof buildBackup>['data']>) {
  return buildBackup({
    exercises: [exercise],
    programs: [program],
    workoutLogs: [workout('w1', '2026-11-01T10:00:00.000Z', 2)],
    settings: [{ id: 'backup-meta', lastBackupAt: '2026-11-01T10:00:00.000Z' }],
    exportedAt: new Date('2026-11-27T08:00:00.000Z'),
    ...overrides,
  });
}

describe('backup file', () => {
  it('builds a versioned file and round-trips through JSON, including sets that omit rir', () => {
    const legacy = workout('w-old', '2026-10-01T10:00:00.000Z');
    delete legacy.loggedExercises[0].sets[0].rir;
    const backup = buildBackup({
      exercises: [exercise],
      programs: [{ ...program, exercises: [{ exerciseId: 'squat', targetSets: 3 }] }],
      workoutLogs: [legacy],
      settings: [],
      exportedAt: new Date('2026-11-27T08:00:00.000Z'),
    });
    expect(backup.app).toBe('gymbuddy');
    expect(backup.schemaVersion).toBe(BACKUP_SCHEMA_VERSION);
    expect(backupFileName(new Date('2026-11-27T22:00:00'))).toBe('gymbuddy-backup-2026-11-27.json');

    const parsed = parseBackup(JSON.stringify(backup));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.backup.data.workoutLogs[0].loggedExercises[0].sets[0].rir).toBeUndefined();
    expect(parsed.backup.data.programs[0].exercises[0].targetRir).toBeUndefined();
    const summary = summarizeBackup(parsed.backup);
    expect(summary).toMatchObject({ exercises: 1, programs: 1, workoutLogs: 1 });
  });

  it('rejects a bad file, a future schema, and a history-only export', () => {
    expect(parseBackup('not json').ok).toBe(false);
    expect(parseBackup('not json')).toMatchObject({ error: 'That file is not valid JSON.' });
    expect(parseBackup({ app: 'other', schemaVersion: 1, exportedAt: '2026-11-01T00:00:00.000Z', data: {} }))
      .toMatchObject({ error: 'That file is not a GymBuddy backup.' });
    const future = sampleBackup();
    future.schemaVersion = 99;
    expect(parseBackup(future).ok).toBe(false);
    expect(parseBackup(future)).toMatchObject({ error: expect.stringContaining('schema 99') });
    expect(parseBackup([{ id: 'w1' }])).toMatchObject({ error: expect.stringContaining('history-only') });
  });

  it('merges by id: inserts new rows, skips older or equal workouts, updates a later workout date', () => {
    const backup = sampleBackup();
    const parsed = parseBackup(JSON.stringify(backup));
    if (!parsed.ok) throw new Error('expected valid backup');
    parsed.backup.data.workoutLogs.push({
      id: 'w-new',
      date: new Date('2026-11-20T10:00:00.000Z'),
      loggedExercises: [{ exerciseId: 'squat', sets: [{ weight: 60, reps: 5 }] }],
    });
    parsed.backup.data.workoutLogs[0] = {
      ...parsed.backup.data.workoutLogs[0],
      date: new Date('2026-11-02T10:00:00.000Z'),
    };

    const plan = planMerge({
      exercises: [{ id: 'custom-1', name: 'Custom Curl', isCustom: true }],
      programs: [{ id: 'five-day-40plus', name: '5-Day', exercises: [] }],
      workoutLogs: [{ id: 'w1', date: '2026-11-01T10:00:00.000Z' }],
      settings: [{ id: 'backup-meta', lastBackupAt: '2026-11-20T00:00:00.000Z' }],
    }, parsed.backup);

    expect(plan.inserts.workoutLogs.map(row => (row as { id: string }).id)).toEqual(['w-new']);
    expect(plan.updates.workoutLogs.map(row => (row as { id: string }).id)).toEqual(['w1']);
    expect(plan.skipped.exercises).toBe(1);
    expect(plan.skipped.programs).toBe(1);
    expect(plan.skipped.settings).toBe(1);
    expect(mergeAction('workoutLogs', { id: 'w1', date: '2026-11-03T00:00:00.000Z' }, { id: 'w1', date: '2026-11-01T00:00:00.000Z' })).toBe('skip');
  });

  it('reminds when there has never been a backup or the last one is 14 days old', () => {
    const now = new Date('2026-11-27T00:00:00.000Z');
    expect(backupReminder(null, now)).toContain('No backup yet');
    expect(backupReminder('2026-11-20T00:00:00.000Z', now)).toBeNull();
    expect(backupReminder('2026-11-01T00:00:00.000Z', now)).toContain('days ago');
  });
});

describe('deliverBackupFile', () => {
  it('shares a file when the browser can share files', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const result = await deliverBackupFile('{}', 'gymbuddy-backup-2026-11-27.json', {
      share,
      canShare: () => true,
    });
    expect(result).toBe('shared');
    expect(share).toHaveBeenCalled();
    const payload = share.mock.calls[0][0] as { files: File[] };
    expect(payload.files[0].name).toBe('gymbuddy-backup-2026-11-27.json');
  });

  it('treats a cancelled share as cancelled and downloads when files cannot be shared', async () => {
    const abort = new DOMException('cancelled', 'AbortError');
    const cancelled = await deliverBackupFile('{}', 'gymbuddy-backup-2026-11-27.json', {
      share: vi.fn().mockRejectedValue(abort),
      canShare: () => true,
    });
    expect(cancelled).toBe('cancelled');

    const createObjectURL = vi.fn().mockReturnValue('blob:backup');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    const downloaded = await deliverBackupFile('{}', 'gymbuddy-backup-2026-11-27.json', {
      share: vi.fn(),
      canShare: () => false,
    });
    expect(downloaded).toBe('downloaded');
    expect(createObjectURL).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
