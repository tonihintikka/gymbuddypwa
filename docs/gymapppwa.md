Gym Tracker App - V1 Feature List (Progressive Web App - PWA)This document outlines the core features planned for the first version (V1) of the simple weightlifting tracker app, implemented as a Progressive Web App (PWA) using React, TypeScript, HTML, and CSS. The application will follow Material Design principles for UI/UX. The focus remains on fast usage and ease of use, incorporating exercise and program management, with data stored locally in the browser using IndexedDB.1. Core Data Models (Examples)(Conceptual data structure remains the same. TypeScript interfaces/types will define these structures in the code.)interface Exercise { id: string; name: string; isCustom: boolean; }interface SetLog { weight: number; reps: number; isFailure?: boolean; isPaused?: boolean; isSlowEccentric?: boolean; }interface LoggedExercise { exerciseId: string; // Or store full Exercise object? sets: SetLog[]; }interface WorkoutLog { id: string; date: Date; loggedExercises: LoggedExercise[]; programId?: string; }interface ProgramExercise { exerciseId: string; targetSets?: number; targetReps?: string; // e.g., "5" or "8-12" notes?: string; }interface Program { id: string; name: string; description?: string; exercises: ProgramExercise[]; }// TypeScript interfaces/types define these data structures.
// No specific pseudocode needed here.
2. Exercise Management 📋UI: A dedicated section/page implemented as a React component (e.g., <ExerciseManagementScreen>), using JSX for structure. Styling follows Material Design, potentially using a library like MUI (Material UI for React).Visual: A list component (e.g., Material UI <List>) displaying exercise names.List: Displays a combined list fetched asynchronously (e.g., using useEffect hook) from IndexedDB (custom exercises) and a predefined list. State managed within React (e.g., useState).Common, built-in exercises. (Examples categorized by equipment). (Sisältää yleisimmät liikkeet).User-added custom exercises fetched from IndexedDB.Add/Edit:A React component (e.g., <AddExerciseForm>) with controlled inputs and a Material UI Button [+] Add Custom Exercise.Uses TypeScript for type safety in form handling and data object creation. Saves new Exercise object to IndexedDB. (Omien liikkeiden lisäys).// --- Exercise Management (React/TS) ---

// React Component: <ExerciseManagementScreen>
FUNCTION displayExerciseScreen():
  // State variables using useState hook:
  exercisesList = useState([]) // Holds combined list for display
  isLoading = useState(true)

  // Fetch data using useEffect hook on component mount:
  useEffect(() => {
    builtIn = GET builtIn // From constant/config
    custom = await GET customExercises FROM indexedDB store 'exercises' // Async call
    SET exercisesList TO builtIn + custom
    SET isLoading TO false
  }, []) // Empty dependency array means run once

  // Render logic using JSX:
  IF isLoading:
    DISPLAY LoadingIndicator component
  ELSE:
    DISPLAY ExerciseListComponent props={exercisesList}
    DISPLAY AddExerciseFormComponent onAdd={refreshList} // Pass callback to refresh

// React Component: <AddExerciseForm>
FUNCTION addCustomExercise(exerciseName: string): // TypeScript type annotation
  IF exerciseName is valid:
    newExercise: Exercise = { id: generateId(), name: exerciseName, isCustom: true } // Use Exercise type
    await SAVE newExercise TO indexedDB store 'exercises' // Async call
    CALL onAdd() // Callback to refresh list in parent component

// Event handling within the form component triggers addCustomExercise
3. Program Management 📝UI: Dedicated section/page implemented as React components (e.g., <ProgramListScreen>, <ProgramEditor>), styled using Material Design (e.g., MUI components like <Card>, <TextField>, <Button>).List: Shows built-in examples and custom programs fetched asynchronously from IndexedDB, managed by React state.Actions: Material UI Buttons [+] Create New Program, [Copy Program].Program Editor (Simple V1):A React component (<ProgramEditor>) with controlled inputs (Material UI <TextField>) for name.Uses state (useState, useReducer) to manage the program object being edited (defined by Program TypeScript interface).[Add Exercise] button opens a modal/dialog component (<ExercisePickerModal>) populated from the exercise list.TypeScript ensures type safety when adding ProgramExercise objects.[Save Program] button saves the Program object to IndexedDB.// --- Program Management (React/TS) ---

// React Component: <ProgramListScreen>
FUNCTION displayProgramScreen():
  // useState for program lists (built-in, custom)
  // useEffect to fetch custom programs from IndexedDB
  // Render lists using Material UI components
  // Buttons trigger navigation/opening the editor

// React Component: <ProgramEditor>
FUNCTION openProgramEditor(programToEdit?: Program): // Optional Program type
  // useState or useReducer to manage 'currentProgram' state (type: Program)
  // Initialize state based on new/edit/copy action

  // Render Material UI form elements bound to 'currentProgram' state
  DISPLAY <TextField> for program name
  DISPLAY list of ProgramExercises using mapping and child components
  DISPLAY <Button> [Add Exercise] -> opens ExercisePickerModal
  DISPLAY <Button> [Save Program] -> calls saveProgram()

FUNCTION addExerciseToProgram(exercise: Exercise): // Type safety
  // Get target sets/reps from state/inputs
  newProgramExercise: ProgramExercise = { exerciseId: exercise.id, ... } // Use types
  // Update 'currentProgram' state using state setter function (e.g., from useState/useReducer)
  // React re-renders the list automatically

FUNCTION saveProgram():
  currentProgramState = GET current program state
  await SAVE currentProgramState TO indexedDB store 'programs'
  // Handle navigation/feedback

// Event handlers within components trigger these functions
4. Workout Execution 💪UI: Main workout page implemented as a primary React component (e.g., <WorkoutScreen>), composed of smaller components (<CurrentExerciseDisplay>, <SetInputForm>, <LoggedSetsList>). Mobile-first responsive design using Material Design components and CSS.Starting: Material UI Buttons trigger state changes handled by React to switch between Ad-hoc and Program modes.Live Workout Screen (Program/Ad-hoc):React components display exercise info, targets, and Material UI input fields (<TextField type="number">).React state (useState, useReducer) manages the currentWorkoutLog object (typed with TypeScript WorkoutLog interface), current exercise, etc.[Log Set] button triggers a function that updates the React state. React handles re-rendering the UI (e.g., the <LoggedSetsList>) to show the new set. The function also saves the set to the currentWorkoutLog state object.Flexibility: State management logic allows adding/modifying sets beyond the plan within the currentWorkoutLog object.Finishing: [Finish Workout] button triggers saving the final currentWorkoutLog state object to IndexedDB.// --- Workout Execution (React/TS) ---

// React Component: <WorkoutScreen>
FUNCTION WorkoutScreen():
  // State for workout mode ('adhoc' or 'program')
  // State for currentWorkoutLog (type: WorkoutLog | null)
  // State for activeProgram (type: Program | null) if in program mode
  // State for current exercise index/details

  FUNCTION startWorkout(mode: string, program?: Program):
    SET workout mode state
    SET currentWorkoutLog state = CREATE new WorkoutLog(...) // Use TS interface
    IF mode == 'program':
      SET activeProgram state = program
    // Initialize other relevant states

  FUNCTION logSetHandler(setLogData: SetLog): // Type safety
    // Update the currentWorkoutLog state immutably:
    // 1. Find the correct LoggedExercise within currentWorkoutLog state
    // 2. Create a new sets array including the newSet
    // 3. Create a new LoggedExercise object with the new sets array
    // 4. Create a new workout log object with the updated LoggedExercise
    SET currentWorkoutLog state = updatedWorkoutLog // Triggers re-render

  FUNCTION finishWorkoutHandler():
    finalLog = GET currentWorkoutLog state
    await SAVE finalLog TO indexedDB store 'workoutLogs'
    // Reset state, navigate, show summary, etc.

  // Render child components based on state:
  // <StartWorkoutOptions onStart={startWorkout} />
  // IF currentWorkoutLog is active:
  //   <CurrentExerciseDisplay ... />
  //   <SetInputForm onLogSet={logSetHandler} />
  //   <LoggedSetsList sets={relevantSetsFromState} />
  //   <Button onClick={finishWorkoutHandler}>Finish Workout</Button>
5. Workout History 📊UI: History page implemented as React components (<HistoryListScreen>, <WorkoutDetailView>), using Material UI for lists (<List>, <ListItem>) and display elements.List View: useEffect fetches WorkoutLog objects from IndexedDB. useState holds the list. React maps the state array to Material UI <ListItem> components.Detail View: Clicking a list item updates React state (e.g., selectedWorkoutLog) or navigates to a detail route. The <WorkoutDetailView> component receives the selected log (typed with WorkoutLog) as props and renders the details using JSX and Material UI components.// --- History (React/TS) ---

// React Component: <HistoryListScreen>
FUNCTION HistoryListScreen():
  // useState for workoutLogs list (type: WorkoutLog[])
  // useEffect to fetch logs from IndexedDB on mount
  // Render Material UI List, mapping workoutLogs state to <ListItem> components
  // Each ListItem has onClick handler -> showHistoryDetail(log)

FUNCTION showHistoryDetail(log: WorkoutLog): // Type safety
  // Update state to show detail view or navigate to detail route, passing the log data

// React Component: <WorkoutDetailView>
FUNCTION WorkoutDetailView(props: { workoutLog: WorkoutLog }): // Typed props
  // Render details from props.workoutLog using JSX and Material UI components
6. Local Storage (Browser) 📱💾Primary: IndexedDB - Accessed via asynchronous JavaScript/TypeScript functions, potentially wrapped in a custom hook or service class for easier use within React components.(Alternative: localStorage for simple settings).Data stored persistently in the browser.// --- IndexedDB Interaction (React/TS Context) ---

// Can wrap IndexedDB logic in custom hooks (e.g., useIndexedDB)
// or service classes to manage DB connection and operations.

async FUNCTION SAVE(object: any, storeName: string): Promise<void> { // Use Promises
  // ... (IndexedDB logic using Promises for async handling) ...
}

async FUNCTION GET(storeName: string, criteria = null): Promise<any[]> { // Use Promises
  // ... (IndexedDB logic using Promises for async handling) ...
}

// React components call these async functions (e.g., within useEffect or event handlers)
// and handle loading/error states using useState.
7. PWA Features ✨Service Worker: (service-worker.ts if using TypeScript) - Handled via build tools often integrated with React frameworks (like Create React App or Vite templates) or configured manually. Caches app shell (React build output).Web App Manifest: (manifest.json) - Defines PWA properties. Often generated/managed by the build tool.HTTPS: Required for deployment.Responsiveness: Achieved using CSS (e.g., CSS Modules, Styled Components, or utility classes alongside MUI) and Material Design's responsive grid/components.// --- PWA Setup (Often handled by React build tools like Vite/CRA) ---

// main.tsx (or index.tsx)
// Register service worker (code similar to vanilla JS version, but within React app setup)

// vite.config.ts (or similar build config)
// Configure PWA plugin (e.g., vite-plugin-pwa) to generate service worker and manifest

// public/manifest.json
// Define PWA properties

// Service worker logic (caching strategies) remains conceptually similar.
8. Data Export 📤Functionality: A React component (e.g., in a <SettingsScreen>) triggers an async TypeScript function.Fetching/Formatting: Function fetches data from IndexedDB, formats it to CSV/JSON (type safety helps here).Action: Uses browser APIs (Blob, Object URL, <a> download) triggered from the React component to initiate the download.// --- Settings Component (React/TS) ---
FUNCTION SettingsScreen():
  async FUNCTION handleExportClick():
    try:
      // Show loading state
      allWorkoutLogs: WorkoutLog[] = await GET all WorkoutLogs FROM indexedDB // Async call
      csvString = FORMAT workoutLogs to CSV string // Use utility function
      TRIGGER download using Blob/Object URL method (as described before)
      // Hide loading state, show success message
    catch error:
      // Handle error, show error message
      // Hide loading state

  // Render JSX with Material UI Button
  RETURN <Button onClick={handleExportClick}>Export Workout Data</Button>
9. Addressing "Easy as Possible / Fast Usage"UI/UX: Leverage Material Design principles via a React component library like MUI for consistent, intuitive, and accessible components. Use React's component structure for clarity.Performance: Efficient state management in React, asynchronous IndexedDB, Service Worker caching. Use React developer tools for profiling. TypeScript helps catch errors early.Responsiveness: Utilize Material UI's responsive grid system and component adaptations.// --- Performance/UX Notes (React/TS) ---
// Use React.memo, useMemo, useCallback where appropriate to optimize re-renders.
// Ensure efficient data fetching and state updates.
// Leverage TypeScript for better code quality and fewer runtime errors.
// Utilize Material UI components effectively for good UX patterns.
This updated V1 feature set specifies React and TypeScript as the core implementation technologies and Material Design as the UI/UX foundation for the PWA, leveraging their strengths for building a maintainable and user-friendly application.