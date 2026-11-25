# Data Models

Source of truth: `src/types/models.ts`.

## Exercise

```ts
interface Exercise {
  id: string;
  name: string;
  isCustom: boolean;
  muscleGroup?: MuscleGroup;
  category?: ExerciseCategory;
  side?: 'Front' | 'Back' | 'Other';
  baseExercise?: string;
}
```

Built-in exercises live in `useExercises`. Custom exercises are stored in IndexedDB and merged at runtime.

## Program

```ts
interface Program {
  id: string;
  name: string;
  description?: string;
  exercises: ProgramExercise[];   // flat list (legacy / simple programs)
  days?: ProgramDay[];            // multi-day structure
}
```

`ProgramExercise` carries `targetSets`, `targetReps`, optional `notes`, and optional `targetRir` (reps in reserve the set should finish with).

`ProgramDay` has its own `id`, `name`, optional `description`, and `exercises`.

### Multi-day rule

If `days` exists and is non-empty, the workout start flow shows a day picker and only the selected day's exercises are copied into the `WorkoutLog`. The flat `exercises` array is ignored in that case.

## WorkoutLog

```ts
interface WorkoutLog {
  id: string;
  date: Date;
  loggedExercises: LoggedExercise[];
  programId?: string;
  dayId?: string;
}
```

`LoggedExercise` holds `exerciseId` + an array of `SetLog`.

`SetLog` stores `weight`, `reps`, optional modifiers (`isFailure`, `isPaused`, `isSlowEccentric`), and optional `rir` (0–5). Older logs simply omit `rir`. See [[rir-tracking]].

## Relationships

```
Exercise (catalog)
    ↑ referenced by
ProgramExercise → Program (template)
    ↑ copied into
LoggedExercise → WorkoutLog (instance)
```

Nothing is relational at the database level. All foreign keys are plain string IDs resolved in memory.
