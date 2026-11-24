# Feature Modules

## exercise

Catalog of movements.

- Built-in exercises defined in `useExercises` (50+).
- Custom exercises stored in IndexedDB.
- Filtering by muscle group, category, and base exercise grouping.
- Used by program editors and the "Add Exercise" dialog during a workout.

## program

Templates for workouts.

- Built-in programs (including the 5-day recovery-friendly program) live in `usePrograms`.
- Custom programs created by the user.
- Supports both flat exercise lists and multi-day (`days[]`) structure.
- Day picker appears automatically when `days` is present.

## workout

The active session.

- `useWorkout` holds the in-progress `WorkoutLog` in React state.
- `WorkoutStartScreen` handles program/day selection.
- `ActiveWorkoutScreen` is the logging UI.
- Context keeps the workout alive across tab changes.

## history

Past workouts.

- Lists completed `WorkoutLog`s, newest first.
- Detail view allows editing sets.
- Export produces a JSON file (Web Share on iOS, download elsewhere).
- Delete removes the log from IndexedDB.

## progress

Derived analytics.

- `useExercisesWithHistory` finds exercises that appear in logs.
- `useExerciseProgress` / `useProgressData` compute series (estimated 1RM via Epley, volume, max weight).
- Charts rendered with Chart.js.
- No separate storage; everything is computed from `workoutLogs`.
