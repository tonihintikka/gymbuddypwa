# Data Models

Source of truth: [src/types/models.ts](../src/types/models.ts).

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

Built-in exercises live in [useExercises](../src/features/exercise/hooks/useExercises.ts). Custom exercises are stored in IndexedDB and merged at runtime. See [exercises](exercise.md).

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

`SetLog` stores `weight`, `reps`, optional modifiers (`isFailure`, `isPaused`, `isSlowEccentric`), and optional `rir` (0–5). Older logs simply omit `rir`. See [RIR tracking](rir-tracking.md).

## Relationships

```
Exercise (catalog)
    ↑ referenced by
ProgramExercise → Program (template)
    ↑ copied into
LoggedExercise → WorkoutLog (instance)
```

Nothing is relational at the database level. All foreign keys are plain string IDs resolved in memory.

A backup file is not a fifth model. It is `{ app: 'gymbuddy', schemaVersion, exportedAt, data }` where `data` holds the four IndexedDB stores. Sets and program exercises may omit `rir` and `targetRir`. See [backup and storage](backup-and-storage.md).
