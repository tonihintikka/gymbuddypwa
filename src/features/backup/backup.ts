/**
 * Versioned backup file. Pure functions: no IndexedDB, no DOM.
 * The phone's IndexedDB is the source of truth until the user exports.
 */
import { Exercise, Program, WorkoutLog } from '../../types/models';

export const BACKUP_APP = 'gymbuddy';
export const BACKUP_SCHEMA_VERSION = 1;
export const BACKUP_META_ID = 'backup-meta';
export const BACKUP_REMINDER_DAYS = 14;

export const BACKUP_STORES = ['exercises', 'programs', 'workoutLogs', 'settings'] as const;
export type BackupStoreName = (typeof BACKUP_STORES)[number];

export interface BackupSettingsRecord {
  id: string;
  lastBackupAt?: string;
  [key: string]: unknown;
}

export interface BackupFile {
  app: typeof BACKUP_APP;
  schemaVersion: number;
  exportedAt: string;
  /** True when the file was the old top-level array of workout logs. */
  legacyHistoryOnly?: boolean;
  data: {
    exercises: Exercise[];
    programs: Program[];
    workoutLogs: WorkoutLog[];
    settings: BackupSettingsRecord[];
  };
}

export interface BackupSummary {
  exercises: number;
  programs: number;
  workoutLogs: number;
  settings: number;
  earliest: string | null;
  latest: string | null;
}

export type ParseResult =
  | { ok: true; backup: BackupFile }
  | { ok: false; error: string };

export type MergeAction = 'insert' | 'update' | 'skip';

export interface MergePlan {
  inserts: Record<BackupStoreName, unknown[]>;
  updates: Record<BackupStoreName, unknown[]>;
  skipped: Record<BackupStoreName, number>;
}

export function formatBackupDay(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function backupFileName(date: Date): string {
  return `gymbuddy-backup-${formatBackupDay(date)}.json`;
}

export function buildBackup(input: {
  exercises: Exercise[];
  programs: Program[];
  workoutLogs: WorkoutLog[];
  settings: BackupSettingsRecord[];
  exportedAt?: Date;
}): BackupFile {
  const exportedAt = input.exportedAt ?? new Date();
  return {
    app: BACKUP_APP,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: exportedAt.toISOString(),
    data: {
      exercises: input.exercises,
      programs: input.programs,
      workoutLogs: input.workoutLogs.map(workout => ({
        ...workout,
        date: new Date(workout.date).toISOString() as unknown as Date,
      })),
      settings: input.settings,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireId(record: Record<string, unknown>, label: string, index: number): string | ParseResult {
  if (typeof record.id !== 'string' || record.id.trim() === '') {
    return { ok: false, error: `${label} ${index + 1} is missing an id.` };
  }
  return record.id;
}

function checkUnique(ids: string[], label: string): ParseResult | null {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) return { ok: false, error: `${label} has a duplicate id "${id}".` };
    seen.add(id);
  }
  return null;
}

function parseExercises(value: unknown): ParseResult | Exercise[] {
  if (!Array.isArray(value)) return { ok: false, error: 'Backup data.exercises must be a list.' };
  const ids: string[] = [];
  for (let i = 0; i < value.length; i += 1) {
    const row = value[i];
    if (!isRecord(row)) return { ok: false, error: `Exercise ${i + 1} must be an object.` };
    const id = requireId(row, 'Exercise', i);
    if (typeof id !== 'string') return id;
    if (typeof row.name !== 'string' || row.name.trim() === '') {
      return { ok: false, error: `Exercise "${id}" is missing a name.` };
    }
    if (typeof row.isCustom !== 'boolean') {
      return { ok: false, error: `Exercise "${id}" must say whether it is custom.` };
    }
    ids.push(id);
  }
  const duplicate = checkUnique(ids, 'Exercises');
  if (duplicate) return duplicate;
  return value as Exercise[];
}

function parsePrograms(value: unknown): ParseResult | Program[] {
  if (!Array.isArray(value)) return { ok: false, error: 'Backup data.programs must be a list.' };
  const ids: string[] = [];
  for (let i = 0; i < value.length; i += 1) {
    const row = value[i];
    if (!isRecord(row)) return { ok: false, error: `Program ${i + 1} must be an object.` };
    const id = requireId(row, 'Program', i);
    if (typeof id !== 'string') return id;
    if (typeof row.name !== 'string' || row.name.trim() === '') {
      return { ok: false, error: `Program "${id}" is missing a name.` };
    }
    if (!Array.isArray(row.exercises)) {
      return { ok: false, error: `Program "${id}" is missing its exercise list.` };
    }
    for (let j = 0; j < row.exercises.length; j += 1) {
      const exercise = row.exercises[j];
      if (!isRecord(exercise) || typeof exercise.exerciseId !== 'string') {
        return { ok: false, error: `Program "${id}" exercise ${j + 1} is missing exerciseId.` };
      }
      if (exercise.targetRir != null && typeof exercise.targetRir !== 'number') {
        return { ok: false, error: `Program "${id}" has a target RIR that is not a number.` };
      }
    }
    ids.push(id);
  }
  const duplicate = checkUnique(ids, 'Programs');
  if (duplicate) return duplicate;
  return value as Program[];
}

function parseWorkouts(value: unknown): ParseResult | WorkoutLog[] {
  if (!Array.isArray(value)) return { ok: false, error: 'Backup data.workoutLogs must be a list.' };
  const ids: string[] = [];
  for (let i = 0; i < value.length; i += 1) {
    const row = value[i];
    if (!isRecord(row)) return { ok: false, error: `Workout ${i + 1} must be an object.` };
    const id = requireId(row, 'Workout', i);
    if (typeof id !== 'string') return id;
    if (typeof row.date !== 'string' && typeof row.date !== 'number' && !(row.date instanceof Date)) {
      return { ok: false, error: `Workout "${id}" is missing a date.` };
    }
    if (Number.isNaN(new Date(row.date as string).getTime())) {
      return { ok: false, error: `Workout "${id}" has a date that cannot be read.` };
    }
    if (!Array.isArray(row.loggedExercises)) {
      return { ok: false, error: `Workout "${id}" is missing its exercises.` };
    }
    for (let j = 0; j < row.loggedExercises.length; j += 1) {
      const logged = row.loggedExercises[j];
      if (!isRecord(logged) || typeof logged.exerciseId !== 'string' || !Array.isArray(logged.sets)) {
        return { ok: false, error: `Workout "${id}" exercise ${j + 1} is not a set list.` };
      }
      for (let k = 0; k < logged.sets.length; k += 1) {
        const set = logged.sets[k];
        if (!isRecord(set) || typeof set.weight !== 'number' || typeof set.reps !== 'number') {
          return { ok: false, error: `Workout "${id}" has a set without weight and reps.` };
        }
        if (set.rir != null && typeof set.rir !== 'number') {
          return { ok: false, error: `Workout "${id}" has a RIR value that is not a number.` };
        }
      }
    }
    ids.push(id);
  }
  const duplicate = checkUnique(ids, 'Workouts');
  if (duplicate) return duplicate;
  return value as WorkoutLog[];
}

function parseSettings(value: unknown): ParseResult | BackupSettingsRecord[] {
  if (!Array.isArray(value)) return { ok: false, error: 'Backup data.settings must be a list.' };
  const ids: string[] = [];
  for (let i = 0; i < value.length; i += 1) {
    const row = value[i];
    if (!isRecord(row)) return { ok: false, error: `Setting ${i + 1} must be an object.` };
    const id = requireId(row, 'Setting', i);
    if (typeof id !== 'string') return id;
    ids.push(id);
  }
  const duplicate = checkUnique(ids, 'Settings');
  if (duplicate) return duplicate;
  return value as BackupSettingsRecord[];
}

export function parseBackup(input: unknown): ParseResult {
  let value = input;
  if (typeof input === 'string') {
    try {
      value = JSON.parse(input);
    } catch {
      return { ok: false, error: 'That file is not valid JSON.' };
    }
  }
  if (Array.isArray(value)) {
    return parseLegacyHistory(value);
  }
  if (!isRecord(value)) return { ok: false, error: 'That file is not a backup object.' };
  if (value.app !== BACKUP_APP) {
    return { ok: false, error: 'That file is not a GymBuddy backup.' };
  }
  if (typeof value.schemaVersion !== 'number' || !Number.isInteger(value.schemaVersion)) {
    return { ok: false, error: 'The backup is missing a schema version.' };
  }
  if (value.schemaVersion > BACKUP_SCHEMA_VERSION) {
    return {
      ok: false,
      error: `This backup uses schema ${value.schemaVersion}. Update the app before importing it.`,
    };
  }
  if (value.schemaVersion < 1) {
    return { ok: false, error: 'This backup schema version is not supported.' };
  }
  if (typeof value.exportedAt !== 'string' || Number.isNaN(new Date(value.exportedAt).getTime())) {
    return { ok: false, error: 'The backup is missing the date it was exported.' };
  }
  if (!isRecord(value.data)) return { ok: false, error: 'The backup is missing its data.' };

  const exercises = parseExercises(value.data.exercises);
  if (!Array.isArray(exercises)) return exercises;
  const programs = parsePrograms(value.data.programs);
  if (!Array.isArray(programs)) return programs;
  const workoutLogs = parseWorkouts(value.data.workoutLogs);
  if (!Array.isArray(workoutLogs)) return workoutLogs;
  const settings = parseSettings(value.data.settings);
  if (!Array.isArray(settings)) return settings;

  return {
    ok: true,
    backup: {
      app: BACKUP_APP,
      schemaVersion: value.schemaVersion,
      exportedAt: value.exportedAt,
      data: { exercises, programs, workoutLogs, settings },
    },
  };
}

function parseLegacyHistory(value: unknown[]): ParseResult {
  const workoutLogs = parseWorkouts(value);
  if (!Array.isArray(workoutLogs)) return workoutLogs;
  const times = workoutLogs
    .map(workout => new Date(workout.date).getTime())
    .filter(time => !Number.isNaN(time));
  const exportedAt = times.length
    ? new Date(Math.max(...times)).toISOString()
    : new Date(0).toISOString();
  return {
    ok: true,
    backup: {
      app: BACKUP_APP,
      schemaVersion: BACKUP_SCHEMA_VERSION,
      exportedAt,
      legacyHistoryOnly: true,
      data: {
        exercises: [],
        programs: [],
        workoutLogs,
        settings: [],
      },
    },
  };
}

export function workoutHasSets(workout: WorkoutLog): boolean {
  return workout.loggedExercises.some(logged => logged.sets.length > 0);
}

/** Drop workouts whose every exercise has an empty set list. */
export function omitEmptyWorkouts(backup: BackupFile): { backup: BackupFile; skippedEmpty: number } {
  const kept = backup.data.workoutLogs.filter(workoutHasSets);
  return {
    skippedEmpty: backup.data.workoutLogs.length - kept.length,
    backup: {
      ...backup,
      data: { ...backup.data, workoutLogs: kept },
    },
  };
}

export function summarizeBackup(backup: BackupFile): BackupSummary {
  const times = backup.data.workoutLogs
    .map(workout => new Date(workout.date).getTime())
    .filter(time => !Number.isNaN(time))
    .sort((a, b) => a - b);
  return {
    exercises: backup.data.exercises.length,
    programs: backup.data.programs.length,
    workoutLogs: backup.data.workoutLogs.length,
    settings: backup.data.settings.length,
    earliest: times.length ? new Date(times[0]).toISOString() : null,
    latest: times.length ? new Date(times[times.length - 1]).toISOString() : null,
  };
}

function timeOf(value: unknown): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'string' || typeof value === 'number') return new Date(value).getTime();
  return Number.NaN;
}

export function mergeAction(
  store: BackupStoreName,
  existing: Record<string, unknown> | undefined,
  incoming: Record<string, unknown>,
): MergeAction {
  if (!existing) return 'insert';
  if (store === 'workoutLogs') {
    const incomingTime = timeOf(incoming.date);
    const existingTime = timeOf(existing.date);
    if (Number.isFinite(incomingTime) && Number.isFinite(existingTime) && incomingTime > existingTime) {
      return 'update';
    }
    return 'skip';
  }
  if (store === 'settings' && incoming.id === BACKUP_META_ID) {
    const incomingTime = timeOf(incoming.lastBackupAt);
    const existingTime = timeOf(existing.lastBackupAt);
    if (Number.isFinite(incomingTime) && (!Number.isFinite(existingTime) || incomingTime > existingTime)) {
      return 'update';
    }
  }
  return 'skip';
}

export function planMerge(
  existing: Record<BackupStoreName, Array<{ id: string } & Record<string, unknown>>>,
  backup: BackupFile,
): MergePlan {
  const plan: MergePlan = {
    inserts: { exercises: [], programs: [], workoutLogs: [], settings: [] },
    updates: { exercises: [], programs: [], workoutLogs: [], settings: [] },
    skipped: { exercises: 0, programs: 0, workoutLogs: 0, settings: 0 },
  };
  (Object.keys(plan.inserts) as BackupStoreName[]).forEach(store => {
    const local = new Map(existing[store].map(row => [row.id, row]));
    for (const incoming of backup.data[store]) {
      const action = mergeAction(store, local.get(incoming.id) as Record<string, unknown> | undefined, incoming as unknown as Record<string, unknown>);
      if (action === 'insert') plan.inserts[store].push(incoming);
      else if (action === 'update') plan.updates[store].push(incoming);
      else plan.skipped[store] += 1;
    }
  });
  return plan;
}

export function backupReminder(lastBackupAt: string | null, now: Date): string | null {
  if (!lastBackupAt) {
    return 'No backup yet. Export a copy so clearing Safari data does not erase this phone’s history.';
  }
  const then = new Date(lastBackupAt);
  if (Number.isNaN(then.getTime())) {
    return 'No backup yet. Export a copy so clearing Safari data does not erase this phone’s history.';
  }
  const days = (now.getTime() - then.getTime()) / (24 * 60 * 60 * 1000);
  if (days >= BACKUP_REMINDER_DAYS) {
    return `Last backup was ${Math.floor(days)} days ago. Export again so a cache clear cannot erase your history.`;
  }
  return null;
}

export function formatBytes(bytes: number | null): string {
  if (bytes == null || !Number.isFinite(bytes)) return 'unknown';
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
