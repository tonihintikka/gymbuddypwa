# To-Do: Enhanced Exercise Structure

This document outlines the steps to improve the exercise organization within the app.

## 1. Redefine the `Exercise` Data Model (DONE)

The current `Exercise` model in `src/types/models.ts` is too simplistic. We need to add more fields to allow for better filtering and grouping.

**Proposed new `Exercise` interface:**

```typescript
export interface Exercise {
  id: string;
  name: string;
  isCustom: boolean;
  // New fields:
  muscleGroup: MuscleGroup; // e.g., 'Biceps', 'Back', 'Quads'
  category: ExerciseCategory; // e.g., 'Push', 'Pull', 'Legs'
  side: 'Front' | 'Back' | 'Other'; // For frontside/backside categorization
  baseExercise: string; // To group variations, e.g., 'Deadlift' for all deadlift types
}

// We will also need to define these enums/types:
export type MuscleGroup = 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Quads' | 'Hamstrings' | 'Glutes' | 'Calves' | 'Abs' | 'Other';
export type ExerciseCategory = 'Push' | 'Pull' | 'Legs' | 'Core' | 'Full Body' | 'Other';
```

## 2. Update Database Service (DONE)

The `src/services/db.ts` file will need to be updated to reflect the new `Exercise` structure. This includes updating the initial data and any functions that interact with the `exercises` object store.

## 3. Update UI Components (DONE)

The following components will need to be updated to allow users to filter and group exercises based on the new properties:

-   `src/features/exercise/components/ExerciseList.tsx`: This is the main component that will display the exercises. We will need to add UI elements (e.g., dropdowns, buttons) to filter by `muscleGroup`, `category`, etc.
-   `src/features/exercise/components/AddExerciseForm.tsx`: When adding a new custom exercise, the user should be able to specify the new properties.

## 4. Data Migration (DONE)

We need a plan to update existing exercises in users' databases. This could be a one-time migration script that runs when the app is updated. For the built-in exercises, we will update them in `src/services/db.ts`.

## 5. Update Tests

All related tests for the modified components will need to be updated to reflect the changes.
