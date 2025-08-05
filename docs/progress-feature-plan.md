# Feature Plan: Progress & Performance Visualization

This document outlines the tasks required to implement the progress and performance visualization feature.

## 1. Core Logic & Data Handling

- [ ] **Create a new custom hook `useExerciseProgress`**: This hook will be responsible for fetching and processing workout data for a specific exercise.
  - `useExerciseProgress` should take an `exerciseId` as an argument.
  - It should query the IndexedDB `workoutLogs` table to find all sets for that exercise.
  - It should process the raw set data into a time-series format suitable for charting.
- [ ] **Implement Progress Metrics Calculation**: Within the `useExerciseProgress` hook, add functions to calculate key performance indicators from the set data.
  - **Estimated 1-Rep Max (1RM)**: Calculate the daily estimated 1RM for the exercise using a standard formula (e.g., Epley: `weight * (1 + reps / 30)`).
  - **Max Weight**: Track the maximum weight lifted for the exercise per workout session.
  - **Total Volume**: Calculate the total volume (sets x reps x weight) for the exercise per workout session.
  - **Total Reps**: Track the total number of reps performed for the exercise per workout session.

## 2. UI Components

- [ ] **Create `ProgressScreen.tsx`**: This will be the main view for the feature.
  - It should contain a title and a brief description.
  - It will use the `useExerciseProgress` hook to get the data.
- [ ] **Create `ExerciseSelector.tsx`**: A dropdown or searchable list component to allow users to select which exercise they want to view progress for.
  - This component will be used within `ProgressScreen.tsx`.
- [ ] **Create `ProgressChart.tsx`**: A reusable chart component that visualizes the data.
  - It should accept the processed data from `useExerciseProgress` as props.
  - It will use a charting library (e.g., `Chart.js` with `react-chartjs-2` or `Recharts`) to render line graphs for the different metrics (1RM, Volume, etc.).
- [ ] **Create `MetricToggle.tsx`**: Buttons or a dropdown to switch between viewing different metrics (1RM, Max Weight, Volume) on the chart.

## 3. Integration & Navigation

- [ ] **Add Charting Library**: Install a lightweight charting library (e.g., `npm install chart.js react-chartjs-2`).
- [ ] **Add Navigation**: Add a new "Progress" tab to the main application navigation to link to the `ProgressScreen`.
  - This will likely involve modifying the main `App.tsx` or a layout component.
- [ ] **Integrate Components**: Assemble the `ProgressScreen`, `ExerciseSelector`, and `ProgressChart` components to create the final feature view.

## 4. Testing

- [ ] **Unit Tests for `useExerciseProgress`**:
  - Write tests to ensure the data fetching and metric calculations are correct.
  - Mock the IndexedDB service to provide sample workout data.
- [ ] **Component Tests**:
  - Write tests for `ProgressChart.tsx` to ensure it renders correctly with given data.
  - Write tests for `ProgressScreen.tsx` to verify that it displays the components and handles user interaction (selecting an exercise).

## 5. Documentation & Cleanup

- [ ] **Update `README.md`**: Add the new "Progress Visualization" feature to the feature list.
- [ ] **Update `todo.md`**: Link to this feature plan and mark it as in-progress once development begins.
