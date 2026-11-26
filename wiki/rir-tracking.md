# RIR Tracking and Set Recommendations

RIR means reps in reserve: how many more reps you could have done before you could not complete another one. Compiled from the workout and program code. Types: [data models](data-models.md). The seeded program: [programs](program.md). The logging screen: [workout flow](workout-flow.md).

## Source

- [rir.ts](../src/features/workout/rir.ts) — `findLastSetWithRir`, `recommendFromLastRir`, `DEFAULT_WEIGHT_INCREMENT_KG` (2.5).
- [useSetRecommendation](../src/features/workout/hooks/useSetRecommendation.ts)
- [SetInputForm](../src/features/workout/components/SetInputForm.tsx), [ExerciseView](../src/features/workout/components/ExerciseView.tsx)
- [resolveProgramExercise](../src/features/workout/resolveProgramExercise.ts)
- [usePrograms](../src/features/program/hooks/usePrograms.ts), [mergeProgramTargets](../src/features/program/mergeProgramTargets.ts)

## Goal

Log how hard a set actually was, show the hardness the program asked for, and turn the previous session into a one-line load suggestion.

The person using this is 47 and coming back from almost no training. The useful default is RIR 2–3: hard enough to progress, easy enough to repeat five days a week. The app should make that default visible and should not push the load when the last set was already a grind.

## Why RIR 2–3

- RIR 0–1 is a near-max set. It costs more recovery than it is worth for a new lifter, and beginners usually misjudge true failure.
- RIR 2–3 means the set stops with reps left. That is the recovery-friendly band for this user.
- RIR 4+ is so easy that the weight is not doing much. Next time the load can move up a little.

The seeded program follows that split. Primary compounds are target RIR 3. Smaller exercises (curls, pushdowns, laterals, calves, planks, leg curl, leg extension) are target RIR 2. Day 5, the lighter day, is target RIR 3 on every exercise so the end of the week stays easier.

## Data model

Source: [src/types/models.ts](../src/types/models.ts).

```ts
interface SetLog {
  weight: number;
  reps: number;
  isFailure?: boolean;
  isPaused?: boolean;
  isSlowEccentric?: boolean;
  rir?: number; // 0–5, optional
}

interface ProgramExercise {
  exerciseId: string;
  targetSets?: number;
  targetReps?: string;
  notes?: string;
  targetRir?: number; // optional
}
```

Both fields are optional. Logs and programs saved before this change do not have them. IndexedDB stores the object as-is ([db.ts](../src/services/db.ts), still version 1). No schema upgrade. A missing field reads back as `undefined`.

`rir` is written only when the user picks a number ([WorkoutScreen.handleLogSet](../src/features/workout/components/WorkoutScreen.tsx)). Clearing it in [history](history.md) deletes the key so `undefined` is not put into IndexedDB.

## Where it shows up

| Surface | What you see |
|---------|----------------|
| Set logger (`SetInputForm`) | Buttons 0–5. Optional. A second tap clears the choice. Resets after each logged set. |
| Active exercise (`ExerciseView`) | Target line includes `RIR n` when the template has `targetRir`. |
| Logged sets, summary, history | The number, or an en dash when it was not recorded. History edit is a 0–5 field. |
| Program detail | Each exercise shows `RIR n`. Multi-day programs list days (the flat `exercises` array on `five-day-40plus` is empty, so the day list is what makes the targets visible). |
| Day picker | Day card meta appends `RIR 2` or `RIR 2–3`. |

Adding an exercise to a flat program accepts an optional target RIR (`AddExerciseToProgramForm`). Day templates are shown read-only; add/remove still edits the flat list only, and that button is hidden when `days` is present.

`resolveProgramExercise` picks the template row for the active set. For a day program it uses `workout.dayId`, then index, then exercise id. Without that, the 5-day workout would look at `program.exercises`, which is `[]`, and the target RIR would never appear.

## Recommendation

Pure functions in [rir.ts](../src/features/workout/rir.ts). [useSetRecommendation](../src/features/workout/hooks/useSetRecommendation.ts) reads `workoutLogs` and calls them. The in-progress workout is not saved yet, so today's sets do not change the hint.

1. Find the newest saved workout that contains this exercise and at least one set with `rir` in 0–5. Sessions that skipped RIR are ignored.
2. Inside that session, use the last set that has an RIR.
3. Apply one rule to that pair `(weight, rir)`:

| Last RIR | Suggestion |
|----------|------------|
| 0–1 | Same weight. Stop sooner. Message names the template target, or "RIR 2–3" if there is none. |
| 2 | Same weight. |
| 3–5 | Add **2.5 kg**. |

2.5 kg is one 1.25 kg plate per side. The logger is in kilograms, and that is the smallest usual barbell jump. A 5 kg jump is large for someone starting over: an RIR 3 set often becomes an RIR 0 set. The same step is used for every exercise, including dumbbells and bodyweight. It is a hint. "Use N kg" copies it into the weight field. The user can still type something else.

No previous RIR means no banner.

## Seed and migration

The program is `five-day-40plus` in `builtInPrograms` ([usePrograms.ts](../src/features/program/hooks/usePrograms.ts)).

On load, `usePrograms` still inserts a missing built-in and still replaces a saved copy that has no `days` with the code copy. After that, `mergeMissingTargetRir` copies `targetRir` onto saved exercises that lack it.

- Match by exercise id inside the same day (or the flat list).
- If that id has two different targets in code, skip it.
- An existing `targetRir` is left alone, including one the user set.
- Exercises the user added, which are not in the code template, are left alone.
- The old description ("leaving 1-2 reps in the tank") is replaced when targets are filled, because that sentence contradicts RIR 2–3.

Returns null when nothing changed, so the effect does not write on every visit.

## Future

Not built. Do not treat these as current behavior.

- Per-equipment jumps (dumbbells often move 2 kg, some machines 5 kg). Bodyweight exercises could suggest a rep instead of 2.5 kg.
- Look at more than the last session: several RIR 0 workouts in a row, or a week off, should suggest a deload rather than another increase.
- Double progression inside the rep range: add a rep first, add weight only at the top of the range.
- Fold RIR into estimated 1RM (the [progress](progress.md) charts still use raw reps).
- Edit `targetRir` on a day of a built-in program from the program screen.
- A rest timer that lengthens after a low RIR set.
