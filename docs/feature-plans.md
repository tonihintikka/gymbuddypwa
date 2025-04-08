# Feature Implementation Plans

## Feature 1: Save Empty Workout as a New Program

*   **Goal:** Allow users to save the structure of a completed "empty" (ad-hoc) workout as a reusable program template.
*   **Trigger Point:** After successfully finishing an empty workout (i.e., one where `currentWorkout.programId` was not set).
*   **User Interaction:** Prompt the user after they close the `WorkoutSummary` screen, asking if they want to save the workout structure as a new program and requesting a name for it.
*   **Implementation Steps:**
    1.  **Modify `WorkoutScreen.tsx`:**
        *   In `handleFinishWorkout`, store the structure (`loggedExercises`) of the just-completed workout temporarily if it was an empty workout (`!currentWorkout.programId`).
        *   Modify `handleCloseSummary`: If a temporary workout structure exists (meaning an empty workout was just completed and the summary closed), trigger a prompt/dialog to save it as a program. Clear the temporary structure afterward.
    2.  **Create `SaveWorkoutAsProgramDialog.tsx` Component:**
        *   This component will display the prompt.
        *   It needs an input field for the user to enter the new program's name.
        *   It will receive the list of `loggedExercises` from the completed workout as a prop.
        *   Include "Save" and "Cancel" buttons.
    3.  **Implement Program Saving Logic (within the Dialog or `WorkoutScreen`):**
        *   When the user clicks "Save":
            *   Generate a unique ID for the new program (using `uuidv4`).
            *   Create a new `Program` object using the provided name and ID.
            *   Map the `loggedExercises` array to create the `exercises` array for the new program. For simplicity initially, we can just include the `exerciseId` for each exercise in the sequence, without specific set/rep targets.
            *   Use the `useIndexedDB` hook (specifically the `saveItem` function for the `STORES.PROGRAMS` store) to save the newly created `Program` object to the browser's IndexedDB.
            *   Close the dialog and potentially show a confirmation message (e.g., using a toast notification).
    4.  **Refine State Management:** Ensure the temporary storage of the workout structure and the visibility of the dialog are managed correctly using React state in `WorkoutScreen`.

## Feature 2: Enhanced Export ("Export All Data")

*   **Goal:** Provide a way for users to export not only their workout history but also their custom programs and exercises for backup or migration purposes.
*   **User Interaction:** Add a new, separate button on the History screen, distinct from the existing "Export Workout History" button.
*   **Implementation Steps:**
    1.  **Modify `HistoryScreen.tsx`:**
        *   Add a new button, e.g., labelled "Export All Data" or "Backup All Data", within the `.history-actions` div.
    2.  **Modify `useHistory.ts` (or potentially create `useExport.ts`):**
        *   Create a new asynchronous function, e.g., `exportAllData`.
        *   Inside `exportAllData`:
            *   Use the `useIndexedDB` hook's `loadItems` function (or a similar function to get *all* items) to retrieve all data from:
                *   `STORES.WORKOUT_LOGS`
                *   `STORES.PROGRAMS`
                *   `STORES.EXERCISES`
            *   Structure the retrieved data into a single JSON object. A good structure would be:
                ```json
                {
                  "version": 1, // For potential future import features
                  "exportedAt": "ISO_TIMESTAMP",
                  "workoutLogs": [ /* ... array of WorkoutLog objects ... */ ],
                  "programs": [ /* ... array of Program objects ... */ ],
                  "exercises": [ /* ... array of Exercise objects ... */ ]
                }
                ```
            *   Use the existing `downloadJson` utility (or ensure one exists) to create a downloadable file from this JSON object. Use a descriptive filename like `gymtrack_backup_YYYYMMDD.json`.
    3.  **Connect Button to Function:**
        *   In `HistoryScreen.tsx`, wire the `onClick` event of the new "Export All Data" button to call the newly created `exportAllData` function from the hook. 

## Feature 3: Edit Workout Programs

*   **Goal:** Allow users to modify existing workout programs (change name, add/remove/reorder exercises, change targets/notes).
*   **User Interaction:**
    *   Add an "Edit" button to each program item in `ProgramList.tsx`.
    *   Clicking "Edit" navigates to a dedicated program editing screen/view.
*   **Implementation Steps:**
    1.  **UI for Editing:**
        *   Modify `ProgramList.tsx`: Add an "Edit" button.
        *   Create/Modify `ProgramEditScreen.tsx`:
            *   Load program data using `usePrograms` or `useIndexedDB`.
            *   Display program name in an editable input field.
            *   List exercises (`ProgramExercise[]`) with options to:
                *   Reorder (e.g., drag-and-drop).
                *   Remove.
                *   Edit details (target sets/reps, notes) via a dialog/form.
            *   Add a button/mechanism to add *new* exercises to the program (reuse `ExerciseList`?).
            *   Include "Save" and "Cancel" buttons.
    2.  **Update Logic:**
        *   Modify `usePrograms`: Add an `updateProgram` function.
        *   In `ProgramEditScreen.tsx`, on "Save", construct the updated `Program` object and call `updateProgram`.
        *   Handle navigation back to the program list.
    3.  **Navigation:** Set up routing/state management for the edit view.

## Feature 4: Duplicate Workout Programs

*   **Goal:** Allow users to create a copy of an existing program.
*   **User Interaction:**
    *   Add a "Duplicate" option to each program item (e.g., in a "..." menu).
    *   Prompt user for the new program's name, pre-filling with "[Original Name] Copy".
*   **Implementation Steps:**
    1.  **UI:**
        *   Modify `ProgramList.tsx`: Add a "Duplicate" option.
        *   Create `DuplicateProgramDialog.tsx`: Input field for new name, Save/Cancel buttons.
    2.  **Duplication Logic:**
        *   Modify `usePrograms`: Add a `duplicateProgram(originalId, newName)` function.
        *   Inside `duplicateProgram`: Fetch original, deep copy, generate new ID, update name, save using `saveItem`.
        *   Refresh the program list.
    3.  **Connect UI:** Wire the "Duplicate" option to the dialog, and the dialog to the `duplicateProgram` function.

## Feature 5: Share Workout Programs

*   **Goal:** Allow users to share a program definition (e.g., via text, email).
*   **User Interaction:**
    *   Add a "Share" option to each program item (e.g., in a "..." menu).
    *   Trigger Web Share API or copy program data (JSON) to clipboard.
*   **Implementation Steps:**
    1.  **UI:**
        *   Modify `ProgramList.tsx`: Add a "Share" option.
    2.  **Sharing Logic:**
        *   Modify `usePrograms` (or add logic in `ProgramList.tsx`): Add `shareProgram(programId)` function.
        *   Inside `shareProgram`: Fetch program, format data (JSON or text), use `navigator.share` if available, otherwise `navigator.clipboard.writeText`. Handle errors.
    3.  **Connect UI:** Wire the "Share" option to the `shareProgram` function.
    4.  **(Future Consideration):** An import feature would be needed to make sharing fully functional. 