# Programs

Templates. A workout copies a template into a `WorkoutLog`. The template stays unchanged.

## Source

- [usePrograms](../src/features/program/hooks/usePrograms.ts) — `builtInPrograms`, including `five-day-40plus`.
- [mergeProgramTargets](../src/features/program/mergeProgramTargets.ts) — fills a missing `targetRir` on a saved built-in without wiping exercises the user added.
- [ProgramList](../src/features/program/components/ProgramList.tsx), [ProgramDetail](../src/features/program/components/ProgramDetail.tsx), [ProgramExerciseItem](../src/features/program/components/ProgramExerciseItem.tsx).
- [AddExerciseToProgramForm](../src/features/program/components/AddExerciseToProgramForm.tsx) — optional target sets, reps, notes, and target RIR.

## Rules

- Flat programs use `Program.exercises`. Multi-day programs use `Program.days[]`. When `days` is non-empty, the start flow shows a day picker and ignores the flat list. See [workout flow](workout-flow.md).
- `five-day-40plus` has an empty flat list and five days. The list counts exercises inside `days` (`5 days • 27 exercises`). Counting `exercises.length` alone shows 0.
- Compounds on that program are `targetRir` 3. Smaller exercises are 2. Day 5 is 3 on every exercise. Detail: [RIR tracking](rir-tracking.md).
- Built-in ids cannot be deleted (`deleteProgram` refuses them). Custom programs can.
- Seeding and the days migration live in [storage](storage.md).

Types: [data models](data-models.md).
