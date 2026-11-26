# History

Past `WorkoutLog`s. Newest first. No separate summary object: the log stored at finish is the record.

## Source

- [useHistory](../src/features/history/hooks/useHistory.ts) — list, select, delete, update, export.
- [HistoryScreen](../src/features/history/components/HistoryScreen.tsx), [HistoryList](../src/features/history/components/HistoryList.tsx), [WorkoutDetailView](../src/features/history/components/WorkoutDetailView.tsx).

## Rules

- `sortedWorkoutLogs` orders by `date` descending.
- `updateWorkoutLog` writes the edited log back through `saveItem` and reloads. The detail view can edit weight, reps, and RIR. Clearing RIR deletes the key so `undefined` is not stored.
- Delete removes that id from the `workoutLogs` store.
- Export builds a JSON file. On iOS it prefers `navigator.share` with a `File`, then falls back to a blob download. See [PWA](pwa.md).

The log is written only when a workout finishes: [workout flow](workout-flow.md). Charts read the same rows: [progress](progress.md).
