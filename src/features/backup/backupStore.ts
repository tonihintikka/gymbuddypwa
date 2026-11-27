/**
 * Read and write the four IndexedDB stores as one backup.
 * Merge decisions live in backup.ts. This file only moves rows.
 */
import { getAllItems, getDatabase, STORES } from '../../services/db';
import { Exercise, Program, WorkoutLog } from '../../types/models';
import {
  BACKUP_META_ID,
  BACKUP_STORES,
  BackupFile,
  BackupSettingsRecord,
  BackupStoreName,
  buildBackup,
  mergeAction,
} from './backup';

const STORE_BY_KEY: Record<BackupStoreName, string> = {
  exercises: STORES.EXERCISES,
  programs: STORES.PROGRAMS,
  workoutLogs: STORES.WORKOUT_LOGS,
  settings: STORES.SETTINGS,
};

export async function readAllStores(): Promise<{
  exercises: Exercise[];
  programs: Program[];
  workoutLogs: WorkoutLog[];
  settings: BackupSettingsRecord[];
}> {
  const [exercises, programs, workoutLogs, settings] = await Promise.all([
    getAllItems<Exercise>(STORES.EXERCISES),
    getAllItems<Program>(STORES.PROGRAMS),
    getAllItems<WorkoutLog>(STORES.WORKOUT_LOGS),
    getAllItems<BackupSettingsRecord>(STORES.SETTINGS),
  ]);
  return { exercises, programs, workoutLogs, settings };
}

export async function createBackupFile(now = new Date()): Promise<BackupFile> {
  const data = await readAllStores();
  return buildBackup({ ...data, exportedAt: now });
}

export async function readLastBackupAt(): Promise<string | null> {
  const settings = await getAllItems<BackupSettingsRecord>(STORES.SETTINGS);
  const meta = settings.find(row => row.id === BACKUP_META_ID);
  return typeof meta?.lastBackupAt === 'string' ? meta.lastBackupAt : null;
}

export async function recordBackupTime(when = new Date()): Promise<void> {
  const db = await getDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORES.SETTINGS, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not save backup time'));
    tx.objectStore(STORES.SETTINGS).put({
      id: BACKUP_META_ID,
      lastBackupAt: when.toISOString(),
    });
  });
}

export interface ApplyResult {
  inserted: Record<BackupStoreName, number>;
  updated: Record<BackupStoreName, number>;
  skipped: Record<BackupStoreName, number>;
}

function emptyCounts(): Record<BackupStoreName, number> {
  return { exercises: 0, programs: 0, workoutLogs: 0, settings: 0 };
}

function reviveWorkout(workout: WorkoutLog): WorkoutLog {
  return { ...workout, date: new Date(workout.date) };
}

export async function applyBackup(backup: BackupFile, mode: 'merge' | 'replace'): Promise<ApplyResult> {
  const db = await getDatabase();
  const storeIds = BACKUP_STORES.map(key => STORE_BY_KEY[key]);
  const result: ApplyResult = { inserted: emptyCounts(), updated: emptyCounts(), skipped: emptyCounts() };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeIds, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Import failed'));
    tx.onabort = () => reject(tx.error ?? new Error('Import was aborted'));

    let pending = BACKUP_STORES.length;
    const existing: Record<string, Array<{ id: string } & Record<string, unknown>>> = {};

    for (const key of BACKUP_STORES) {
      const request = tx.objectStore(STORE_BY_KEY[key]).getAll();
      request.onsuccess = () => {
        existing[key] = request.result as Array<{ id: string } & Record<string, unknown>>;
        pending -= 1;
        if (pending === 0) writeAll();
      };
      request.onerror = () => tx.abort();
    }

    function writeAll() {
      for (const key of BACKUP_STORES) {
        const store = tx.objectStore(STORE_BY_KEY[key]);
        const incoming = backup.data[key];
        if (mode === 'replace') {
          store.clear();
          for (const row of incoming) {
            store.put(key === 'workoutLogs' ? reviveWorkout(row as WorkoutLog) : row);
            result.inserted[key] += 1;
          }
          continue;
        }
        const local = new Map(existing[key].map(row => [row.id, row]));
        for (const row of incoming) {
          const action = mergeAction(key, local.get((row as { id: string }).id), row as unknown as Record<string, unknown>);
          if (action === 'skip') {
            result.skipped[key] += 1;
            continue;
          }
          store.put(key === 'workoutLogs' ? reviveWorkout(row as WorkoutLog) : row);
          result[action === 'insert' ? 'inserted' : 'updated'][key] += 1;
        }
      }
    }
  });

  return result;
}

export type ShareResult = 'shared' | 'downloaded' | 'cancelled';

export async function deliverBackupFile(
  json: string,
  fileName: string,
  host: Pick<Navigator, 'share' | 'canShare'> = navigator,
): Promise<ShareResult> {
  const blob = new Blob([json], { type: 'application/json' });
  if (host.share && host.canShare) {
    const file = new File([blob], fileName, { type: 'application/json' });
    const shareData = { files: [file], title: 'GymBuddy backup', text: 'GymBuddy backup' };
    if (host.canShare(shareData)) {
      try {
        await host.share(shareData);
        return 'shared';
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}
