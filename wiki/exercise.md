# Exercises

Catalog of movements. Built-ins are compiled into the app. Custom exercises are rows in IndexedDB.

## Source

- [useExercises](../src/features/exercise/hooks/useExercises.ts) — `defaultExercises` plus custom rows from the `exercises` store.
- [ExerciseScreen](../src/features/exercise/components/ExerciseScreen.tsx) and [ExerciseList](../src/features/exercise/components/ExerciseList.tsx).
- [useExerciseFilters](../src/features/exercise/hooks/useExerciseFilters.ts), [FilterChips](../src/features/exercise/components/FilterChips.tsx), [FiltersBottomSheet](../src/features/exercise/components/FiltersBottomSheet.tsx).
- [AddExerciseForm](../src/features/exercise/components/AddExerciseForm.tsx) creates a custom exercise (UUID, `isCustom: true`).

## Rules

- A built-in id is a stable string (`bench-press`, `hack-squat`). The array in `useExercises` is the list.
- Custom exercises are loaded with [useIndexedDB](../src/hooks/useIndexedDB.ts) on `STORES.EXERCISES` and merged at runtime. They are not in the source array.
- Filters are muscle group, category, and grouping by `baseExercise`.
- The same catalog feeds [program editors](program.md) and the add-exercise dialog during a [workout](workout-flow.md).

Shape of an `Exercise`: [data models](data-models.md).
