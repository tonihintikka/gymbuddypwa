# Workout Flow

## Start

`WorkoutStartScreen` shows:

- "Start Empty Workout" → `startWorkout()` with no program.
- Program list. If a program has `days`, clicking it sets local state and shows the day picker.
- Day picker calls `onStartProgram(programId, dayId)`.

`WorkoutScreen` receives this and calls `startProgramWorkout(programId, dayId)`.

## startProgramWorkout

1. Load the program from IndexedDB.
2. If `days` exist and `dayId` is given, use that day's exercises. Otherwise fall back to first day or flat list.
3. Create a new `WorkoutLog` with `programId` and `dayId`.
4. Map the chosen exercises into `loggedExercises` (empty sets).
5. Set it as `currentWorkout`.

## Active Session

`ActiveWorkoutScreen` receives the workout, program, exercises, and callbacks.

- Header shows program name and, if `dayId` is present, the resolved day name.
- Previous / Next change `activeExerciseIndex`.
- Logging a set appends to the current exercise's `sets` array in React state.
- "Add Exercise" appends a new empty `LoggedExercise`.

Nothing is persisted until finish.

## Finish

`finishWorkout`:

1. Captures the current workout.
2. Clears React state.
3. Writes the `WorkoutLog` to IndexedDB via `saveItem`.
4. On failure, restores the workout so the user can retry.

After finish, `WorkoutScreen` shows `WorkoutSummary`. If the workout was empty (no program), it offers to save it as a new program.

## Edit History

`useHistory.updateWorkoutLog` writes an edited `WorkoutLog` back to IndexedDB and reloads. Used by `WorkoutDetailView`.
