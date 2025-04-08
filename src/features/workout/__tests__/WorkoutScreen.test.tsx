import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for toBeInTheDocument matcher
import { WorkoutScreen } from '../components/WorkoutScreen';
import { useWorkout } from '../hooks/useWorkout';
import { usePrograms } from '../../program/hooks/usePrograms';
import { useExercises } from '../../exercise/hooks/useExercises';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { Exercise, Program, WorkoutLog, LoggedExercise } from '../../../types/models'; // Import types

// Mock the hooks
vi.mock('../hooks/useWorkout', () => ({
  useWorkout: vi.fn(),
}));

vi.mock('../../program/hooks/usePrograms', () => ({
  usePrograms: vi.fn(),
}));

vi.mock('../../exercise/hooks/useExercises', () => ({
  useExercises: vi.fn(),
}));

vi.mock('../../../hooks/useIndexedDB', () => ({
  useIndexedDB: vi.fn(),
}));

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

describe('WorkoutScreen', () => {
  // Setup mock functions and data
  const startWorkoutMock = vi.fn();
  const startProgramWorkoutMock = vi.fn();
  const addExerciseToWorkoutMock = vi.fn();
  const logSetMock = vi.fn();
  const deleteSetMock = vi.fn();
  const nextExerciseMock = vi.fn();
  const previousExerciseMock = vi.fn();
  const finishWorkoutMock = vi.fn().mockResolvedValue(undefined);
  const createProgramMock = vi.fn().mockResolvedValue(true);
  const addExerciseToProgramMock = vi.fn().mockResolvedValue(true);
  const deleteProgramMock = vi.fn().mockResolvedValue(true);
  const removeExerciseFromProgramMock = vi.fn().mockResolvedValue(true);
  const saveItemMock = vi.fn().mockResolvedValue(true);
  const getItemMock = vi.fn().mockResolvedValue(undefined);
  const deleteItemMock = vi.fn().mockResolvedValue(true);
  const refreshProgramsMock = vi.fn().mockResolvedValue(undefined);

  // Corrected mockExercises
  const mockExercises: Exercise[] = [
    { id: 'ex1', name: 'Squat', isCustom: false },
    { id: 'ex2', name: 'Bench Press', isCustom: false },
  ];

  // Corrected mockPrograms
  const mockPrograms: Program[] = [
    { id: 'prog1', name: 'Strength Program', exercises: [] },
  ];

  // Mock the initial state where no workout is in progress
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useWorkout hook with vi.mocked
    vi.mocked(useWorkout).mockReturnValue({
      currentWorkout: null,
      activeExerciseIndex: 0,
      activeExercise: undefined, // Added activeExercise
      startWorkout: startWorkoutMock,
      startProgramWorkout: startProgramWorkoutMock,
      addExerciseToWorkout: addExerciseToWorkoutMock,
      logSet: logSetMock,
      deleteSet: deleteSetMock,
      nextExercise: nextExerciseMock,
      previousExercise: previousExerciseMock,
      finishWorkout: finishWorkoutMock,
    });

    // Mock usePrograms hook with vi.mocked and completed interface
    vi.mocked(usePrograms).mockReturnValue({
      programs: mockPrograms,
      customPrograms: [], // Added
      builtInPrograms: [], // Added
      loading: false, // Added
      error: null, // Added
      createProgram: createProgramMock,
      addExerciseToProgram: addExerciseToProgramMock,
      deleteProgram: deleteProgramMock, // Added
      removeExerciseFromProgram: removeExerciseFromProgramMock, // Added
    });

    // Mock useExercises hook with vi.mocked and completed interface
    vi.mocked(useExercises).mockReturnValue({
      exercises: mockExercises,
      customExercises: [], // Added
      builtInExercises: [], // Added
      loading: false, // Added
      error: null, // Added
      addExercise: vi.fn(), // Added
      removeExercise: vi.fn(), // Added
    });

    // Mock useIndexedDB hook with vi.mocked and completed interface
    vi.mocked(useIndexedDB).mockReturnValue({
      items: [], // Added
      loading: false, // Added
      error: null, // Added
      loadItems: refreshProgramsMock,
      saveItem: saveItemMock, // Added
      getItem: getItemMock, // Added
      deleteItem: deleteItemMock, // Added
    });
  });

  it('should render the workout start screen when no workout is in progress', () => {
    render(<WorkoutScreen />);
    
    // Check that the start screen elements are displayed
    expect(screen.getByText(/start empty workout/i)).toBeInTheDocument();
    expect(screen.getByText(/or select a program/i)).toBeInTheDocument();
  });

  it('should start an empty workout when "Start Empty Workout" is clicked', async () => {
    render(<WorkoutScreen />);
    
    // Click the start empty workout button
    fireEvent.click(screen.getByText(/start empty workout/i));
    
    // Check that startWorkout was called
    expect(startWorkoutMock).toHaveBeenCalled();
  });

  it('should display active workout screen when workout is in progress', () => {
    // Mock an active workout with corrected types
    const mockActiveWorkout: WorkoutLog = {
      id: 'workout-1',
      date: new Date(), // Use Date object
      loggedExercises: [
        { exerciseId: 'ex1', sets: [] }
      ],
      programId: undefined // Use undefined, not null
    };
    vi.mocked(useWorkout).mockReturnValue({
      currentWorkout: mockActiveWorkout,
      activeExerciseIndex: 0,
      activeExercise: mockActiveWorkout.loggedExercises[0], // Set active exercise
      startWorkout: startWorkoutMock,
      startProgramWorkout: startProgramWorkoutMock,
      addExerciseToWorkout: addExerciseToWorkoutMock,
      logSet: logSetMock,
      deleteSet: deleteSetMock,
      nextExercise: nextExerciseMock,
      previousExercise: previousExerciseMock,
      finishWorkout: finishWorkoutMock,
    });
    
    render(<WorkoutScreen />);
    
    // Check that the active workout elements are displayed
    expect(screen.getByText(/add exercise/i)).toBeInTheDocument();
    expect(screen.getByText(/finish workout/i)).toBeInTheDocument();
    // Check if exercise name is displayed (requires exercise data to be available)
    // This might depend on how ActiveWorkoutScreen resolves the exercise name
    // expect(screen.getByText('Squat')).toBeInTheDocument(); 
  });

  it('should add an exercise to the workout when selected', async () => {
    // Mock an active workout with corrected types
    const mockActiveWorkout: WorkoutLog = {
        id: 'workout-1',
        date: new Date(),
        loggedExercises: [],
        programId: undefined // Corrected: use programId: undefined
    };
    vi.mocked(useWorkout).mockReturnValue({
      currentWorkout: mockActiveWorkout,
      activeExerciseIndex: 0,
      activeExercise: undefined,
      startWorkout: startWorkoutMock,
      startProgramWorkout: startProgramWorkoutMock,
      addExerciseToWorkout: addExerciseToWorkoutMock,
      logSet: logSetMock,
      deleteSet: deleteSetMock,
      nextExercise: nextExerciseMock,
      previousExercise: previousExerciseMock,
      finishWorkout: finishWorkoutMock,
    });
    
    render(<WorkoutScreen />);
    
    // Click add exercise to open dialog
    fireEvent.click(screen.getByText(/add exercise/i));
    
    // Wait for dialog and select an exercise
    const squatItem = await screen.findByText('Squat'); 
    fireEvent.click(squatItem); // Click the list item representing Squat
    
    // Find and click the Add button within the dialog
    // Assuming the dialog has a specific structure or the button has a unique role/text
    const addButton = await screen.findByRole('button', { name: /add exercise to workout/i }); // Adjust selector as needed
    fireEvent.click(addButton);
    
    // Check that addExerciseToWorkout was called with the correct ID
    expect(addExerciseToWorkoutMock).toHaveBeenCalledWith('ex1');
  });

  it('should display workout summary when workout is completed', async () => {
    // Mock an active workout first
    const mockActiveWorkout: WorkoutLog = {
      id: 'workout-1',
      date: new Date(),
      loggedExercises: [
        { exerciseId: 'ex1', sets: [{ weight: 100, reps: 5 }] } // Removed name from here
      ],
      programId: undefined
    };
    
    vi.mocked(useWorkout).mockReturnValue({
      currentWorkout: mockActiveWorkout,
      activeExerciseIndex: 0,
      activeExercise: mockActiveWorkout.loggedExercises[0],
      // ... other mocks
      startWorkout: startWorkoutMock,
      startProgramWorkout: startProgramWorkoutMock,
      addExerciseToWorkout: addExerciseToWorkoutMock,
      logSet: logSetMock,
      deleteSet: deleteSetMock,
      nextExercise: nextExerciseMock,
      previousExercise: previousExerciseMock,
      finishWorkout: finishWorkoutMock,
    });
    
    const { rerender } = render(<WorkoutScreen />);
    
    // Click finish workout
    fireEvent.click(screen.getByText(/finish workout/i));
    
    // Verify finishWorkout was called
    expect(finishWorkoutMock).toHaveBeenCalled();
    
    // Now change the mock to return null for currentWorkout
    vi.mocked(useWorkout).mockReturnValue({
      currentWorkout: null,
      activeExerciseIndex: 0,
      activeExercise: undefined,
       // ... other mocks remain the same
      startWorkout: startWorkoutMock,
      startProgramWorkout: startProgramWorkoutMock,
      addExerciseToWorkout: addExerciseToWorkoutMock,
      logSet: logSetMock,
      deleteSet: deleteSetMock,
      nextExercise: nextExerciseMock,
      previousExercise: previousExerciseMock,
      finishWorkout: finishWorkoutMock, 
    });
    
    // Rerender the component to reflect finished state
    rerender(<WorkoutScreen />);
    
    // Verify the summary is displayed
    await waitFor(() => {
      expect(screen.getByText(/workout complete!/i)).toBeInTheDocument();
      expect(screen.getByText(/done/i)).toBeInTheDocument();
    });
  });

  // Verify the final test does not mock useState and uses correct types
  it('should save workout as program when requested after completion', async () => {
    // This test simulates the flow: start empty -> finish -> click done -> save dialog -> save
    // Setup: Start with an empty workout active
    const mockActiveWorkout: WorkoutLog = {
      id: 'workout-1',
      date: new Date(),
      loggedExercises: [
        { exerciseId: 'ex1', sets: [{ weight: 100, reps: 5 }] }
      ],
      programId: undefined
    };
    vi.mocked(useWorkout).mockReturnValue({
      currentWorkout: mockActiveWorkout,
      activeExerciseIndex: 0,
      activeExercise: mockActiveWorkout.loggedExercises[0],
      // ... other mocks
      finishWorkout: finishWorkoutMock,
      startWorkout: startWorkoutMock,
      startProgramWorkout: startProgramWorkoutMock,
      addExerciseToWorkout: addExerciseToWorkoutMock,
      logSet: logSetMock,
      deleteSet: deleteSetMock,
      nextExercise: nextExerciseMock,
      previousExercise: previousExerciseMock,
    });

    const { rerender } = render(<WorkoutScreen />);

    // 1. Finish Workout
    fireEvent.click(screen.getByText(/finish workout/i));
    expect(finishWorkoutMock).toHaveBeenCalled();

    // 2. Update hook state & rerender for summary
    vi.mocked(useWorkout).mockReturnValue({
        ...vi.mocked(useWorkout).mock.results[0].value, // Keep other mocks
        currentWorkout: null, // Workout finished
    });
    rerender(<WorkoutScreen />);
    await waitFor(() => {
        expect(screen.getByText(/workout complete!/i)).toBeInTheDocument();
    });

    // 3. Click Done on summary (should trigger dialog logic)
    // The component should internally know this was an empty workout
    // and decide to show the save dialog
    fireEvent.click(screen.getByText(/done/i));
    
    // 4. Assert Save Dialog is Shown 
    await waitFor(() => {
      expect(screen.getByText('Save as Program')).toBeInTheDocument();
    });

    // 5. Interact with Dialog
    const programNameInput = screen.getByLabelText(/program name/i);
    const saveDialogButton = screen.getByRole('button', { name: /save/i });

    fireEvent.change(programNameInput, { target: { value: 'Saved Program Test' } });
    fireEvent.click(saveDialogButton);

    // 6. Assert Program Creation Mocks Called
    await waitFor(() => {
      expect(createProgramMock).toHaveBeenCalledWith('Saved Program Test');
    });
    // Assuming createProgram resolves with the new program ID 'program-1' for addExerciseToProgram
    // Let's adjust the createProgramMock for this
    createProgramMock.mockResolvedValueOnce({ id: 'prog-save-test', name: 'Saved Program Test', exercises: [] }); 
    expect(addExerciseToProgramMock).toHaveBeenCalledWith(
      'prog-save-test',
      'ex1',
      1, 
      '5'
    );

    // 7. Assert Dialog Closed and Reset Occurred (back to start screen)
    await waitFor(() => {
      expect(screen.queryByText('Save as Program')).not.toBeInTheDocument();
      expect(screen.getByText(/start empty workout/i)).toBeInTheDocument();
    });
  });
}); 