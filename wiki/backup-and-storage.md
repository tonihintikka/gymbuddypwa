# Backup and storage

IndexedDB on this phone is the only copy of workout history until the user exports a file. Clearing Safari data can delete it. Persistent storage asks the browser to be less eager. The file is the copy that survives.

## Source

- [backup.ts](../src/features/backup/backup.ts) — file shape, validation, merge decisions.
- [backupStore.ts](../src/features/backup/backupStore.ts) — read the four stores, one transaction to write them back, share or download.
- [persistentStorage.ts](../src/features/backup/persistentStorage.ts) — `navigator.storage.persist` and `estimate`.
- [DataSection](../src/features/backup/components/DataSection.tsx) — opened from History via **Backup & data**. The bottom nav stays five tabs.
- [App.tsx](../src/App.tsx) — calls `ensurePersistentStorage` after the database opens.

## Export

File name: `gymbuddy-backup-YYYY-MM-DD.json`.

```ts
{
  app: 'gymbuddy',
  schemaVersion: 1,
  exportedAt: string, // ISO
  data: {
    exercises: Exercise[],      // custom rows only; built-ins live in code
    programs: Program[],        // includes seeded built-ins, with targetRir when set
    workoutLogs: WorkoutLog[],  // sets keep rir and modifiers when present
    settings: { id: string }[]
  }
}
```

On iOS, if `navigator.canShare({ files })` is true, the file goes through `navigator.share`. Otherwise the app downloads a blob. Cancelling the share sheet does not record a backup. A successful share or download writes `{ id: 'backup-meta', lastBackupAt }` in the settings store.

The data screen says when the last backup was, and nags if that was 14 days ago or never.

## Import

Pick a `.json` file. [parseBackup](../src/features/backup/backup.ts) checks `app`, integer `schemaVersion` (only 1 today), `exportedAt`, and that each list is an array of records with ids. A set must have numeric `weight` and `reps`. `rir` and `targetRir` may be missing. A future schema version is rejected with a message to update the app. The old history-only export is a top-level JSON array of workout logs. Import detects that array, validates each log, and treats the file as workouts only (`legacyHistoryOnly`). Programs and custom exercises are not in it, so Replace all is not offered. `rir` may be missing. An exercise id that is not in the catalog (a custom UUID from another phone) is still stored. History, the workout summary, and an active session show that row as “Unknown exercise” instead of dropping it.

Workouts whose every exercise has an empty `sets` array can be skipped. The import screen checkbox defaults to skip. Uncheck it to keep those logs.

The screen then shows counts and the workout date range. Nothing is written until the user picks one of:

**Merge.** One readwrite transaction across `exercises`, `programs`, `workoutLogs`, and `settings`.

- New id → insert.
- Workout id already on the phone → replace only when the backup workout’s `date` is strictly later. Same or earlier date stays (a local edit at that timestamp is kept).
- Program, custom exercise, or other setting already on the phone → skip. Those records have no updated-at field, so the phone copy wins.
- `backup-meta` → replace only when `lastBackupAt` is strictly later.

**Replace all.** Confirm, then the same transaction clears the four stores and writes every row from the file. Rows that are not in the file are deleted.

After a successful import the page reloads so the history, program, and exercise screens read the new rows.

## Persistent storage

If `navigator.storage` is missing, the screen says the browser does not support it and does not throw. Otherwise, when `persisted()` is false, startup calls `persist()`. The screen also shows `estimate()` usage and quota when the browser returns them.

iOS can still evict data. The backup file is the durable copy.
