# Plan to Fix Linter Errors in Test Files

This document outlines the plan to address the linter errors and potential issues identified in the following test files:

## 1. `src/features/workout/__tests__/useWorkout.test.ts`

**Problem:** This test file heavily relies on mocking `React.useState` directly, which is brittle and bypasses the hook's actual state management. Mock data and other hook mocks might also have type inconsistencies.

**Fix Plan:**

1.  **Remove `React.useState` Mock:** Delete the manual mock of `React.useState` (lines 27-44 approx).
2.  **Refactor Tests:** Update tests to use the standard `renderHook` and `act` pattern.
    *   Call hook functions (e.g., `result.current.startWorkout()`) inside `act(...)`.
    *   Assert state changes by checking `result.current` after the `act` block.
3.  **Verify Mock Data Types:** Ensure `mockExercises` and `mockPrograms` strictly adhere to the `Exercise` and `Program` interfaces defined in `src/types/models.ts`. Correct or remove any invalid properties (like `category` or `equipment` if they don't exist).
4.  **Verify Mocked Hook Returns:** Ensure the return values provided in `vi.mocked(useIndexedDB).mockReturnValue(...)`, `vi.mocked(useExercises).mockReturnValue(...)`, and `vi.mocked(usePrograms).mockReturnValue(...)` fully match the actual interfaces of those hooks (including all functions).
5.  **Use `vi.mocked()`:** Replace any `(hook as any).mockReturnValue(...)` with `vi.mocked(hook).mockReturnValue(...)` for improved type safety.

## 2. `src/features/workout/__tests__/WorkoutScreen.test.tsx`

**Problem:** Similar to `useWorkout.test.ts`, there are potential type mismatches in mock data (especially `programId` being `null` instead of `undefined`, and extra properties in mock exercises/workouts). Hook mocks might be incomplete, and `as any` is used.

**Fix Plan:**

1.  **Correct Mock Data Types:**
    *   Fix `mockExercises` to only include valid `Exercise` properties (`id`, `name`, `isCustom`).
    *   Ensure `programId` in any mock `WorkoutLog` objects is `undefined` or a `string`, never `null`.
    *   Remove any extraneous properties from mock objects (e.g., `program` instead of `programId`, `name` inside `loggedExercises`).
2.  **Complete Hook Mocks:** Add any missing functions to the `.mockReturnValue(...)` calls for `usePrograms` (e.g., `deleteProgram`, `removeExerciseFromProgram`) and `useIndexedDB` (e.g., `saveItem`, `getItem`, `deleteItem`) in the `beforeEach` block for completeness.
3.  **Use `vi.mocked()`:** Replace `(hook as any).mockReturnValue(...)` with `vi.mocked(hook).mockReturnValue(...)`.
4.  **Verify Last Test:** Examine the final test (`'should save workout as program...'`) to ensure it doesn't rely on mocking `React.useState`. If it does, refactor it to simulate user interactions as done in `WorkoutScreenReset.test.tsx`.

## 3. `src/features/workout/components/__tests__/WorkoutStartScreen.test.tsx`

**Problem:** No significant issues identified. The file appears well-structured and follows good testing practices.

**Fix Plan:**

*   No fixes planned. The red indicator is likely due to uncommitted changes or minor linting rules unrelated to functional errors.

## 4. `src/features/workout/__tests__/WorkoutScreenReset.test.tsx`

**Problem:** Previous edits resolved most errors, but the file might still show as red due to uncommitted changes.

**Fix Plan:**

*   No further fixes planned unless new errors appear after committing changes. 