# Progress

Charts derived from `workoutLogs`. Nothing in this tab is stored.

## Source

- [ProgressScreen](../src/features/progress/components/ProgressScreen.tsx) — Chart.js via `react-chartjs-2`.
- [useProgressData](../src/features/progress/hooks/useProgressData.ts) — one series for the selected exercise and time range.
- [useExerciseProgress](../src/features/progress/hooks/useExerciseProgress.ts) — per-workout series for one exercise.
- [useExercisesWithHistory](../src/features/progress/hooks/useExercisesWithHistory.ts) — exercises that appear in logs, with a workout count, sorted ahead of the rest.

## Rules

- Estimated 1RM is Epley: `weight * (1 + reps / 30)`. Reps of 0 yield 0 in `useExerciseProgress`. RIR is not an input.
- `useProgressData` buckets sets by calendar day, drops days outside the range (`7D`, `30D`, `90D`, `1Y`, or all), and downsamples to 60 points.
- A day point keeps the max estimated 1RM, the max weight, and the sums of volume (`weight * reps`) and reps.
- Both hooks read the `workoutLogs` store. They do not write.

Logs come from [history](history.md). The set shape is in [data models](data-models.md).
