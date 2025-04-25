import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWorkout } from '../hooks/useWorkout';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { useExercises } from '../../exercise/hooks/useExercises';
import { usePrograms } from '../../program/hooks/usePrograms';
import { Exercise, Program, ProgramExercise, WorkoutLog } from '../../../types/models'; // Import types
import { STORES } from '../../../services/db'; // Import STORES enum

// Mock dependencies
vi.mock('../../../hooks/useIndexedDB'); // Keep this basic mock
vi.mock('../../exercise/hooks/useExercises');
vi.mock('../../program/hooks/usePrograms');

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

describe('useWorkout', () => {
  // Mocks for specific store instances
  const workoutLogSaveItemMock = vi.fn().mockResolvedValue(true);
  const programGetItemMock = vi.fn();
  
  // Default mocks (can be overridden in specific tests if needed)
  const genericSaveItemMock = vi.fn().mockResolvedValue(true);
  const genericGetItemMock = vi.fn().mockResolvedValue(undefined);
  const genericLoadItemsMock = vi.fn().mockResolvedValue(undefined);
  const genericDeleteItemMock = vi.fn().mockResolvedValue(true);

  // Corrected mockExercises
  const mockExercises: Exercise[] = [
    { id: 'ex1', name: 'Squat', isCustom: false },
    { id: 'ex2', name: 'Bench Press', isCustom: false },
  ];

  // Corrected mockPrograms
  const mockProgramsData: Program[] = [
    { 
      id: 'prog1', 
      name: 'Strength Program', 
      exercises: [
        { exerciseId: 'ex1', targetSets: 3, targetReps: '5' } as ProgramExercise
      ] 
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers(); // Use fake timers
    vi.setSystemTime(new Date(2021, 0, 1, 0, 0, 0, 0)); // Set system time to Jan 1, 2021
    vi.clearAllMocks();
    
    // Mock useIndexedDB as a factory based on store name
    vi.mocked(useIndexedDB).mockImplementation((storeName) => {
      if (storeName === STORES.WORKOUT_LOGS) {
        return {
          saveItem: workoutLogSaveItemMock,
          getItem: genericGetItemMock, // Use generic if specific not needed
          loadItems: genericLoadItemsMock,
          deleteItem: genericDeleteItemMock,
          items: [], 
          loading: false,
          error: null,
        };
      } else if (storeName === STORES.PROGRAMS) {
        return {
          saveItem: genericSaveItemMock, 
          getItem: programGetItemMock, // Use specific mock for programs
          loadItems: genericLoadItemsMock,
          deleteItem: genericDeleteItemMock,
          items: mockProgramsData, // Provide programs data if needed
          loading: false,
          error: null,
        };
      }
      // Default generic mock for other stores
      return {
          saveItem: genericSaveItemMock, 
          getItem: genericGetItemMock,
          loadItems: genericLoadItemsMock,
          deleteItem: genericDeleteItemMock,
          items: [], 
          loading: false,
          error: null,
      };
    });
    
    vi.mocked(useExercises).mockReturnValue({
      exercises: mockExercises,
      addExercise: vi.fn(),
      removeExercise: vi.fn(),
      customExercises: [],
      builtInExercises: [],
      loading: false,
      error: null,
    });
    
    vi.mocked(usePrograms).mockReturnValue({
      programs: mockProgramsData,
      createProgram: vi.fn(), 
      addExerciseToProgram: vi.fn(),
      deleteProgram: vi.fn(),
      removeExerciseFromProgram: vi.fn(),
      customPrograms: [],
      builtInPrograms: [],
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers(); // Restore real timers
    // No need to restore dateSpy
  });

  // Test 1: Initialization
  it('should initialize with null currentWorkout', () => {
    const { result } = renderHook(() => useWorkout());
    
    expect(result.current.currentWorkout).toBeNull();
    expect(result.current.activeExerciseIndex).toBe(0);
  });

  // Test 2: Start Empty Workout
  it('should start a new empty workout', () => {
    const { result } = renderHook(() => useWorkout());
    
    expect(result.current.currentWorkout).toBeNull(); // Verify initial state

    act(() => {
      result.current.startWorkout();
    });

    expect(result.current.currentWorkout).not.toBeNull();
    expect(result.current.currentWorkout?.id).toBe('mock-uuid');
    expect(result.current.currentWorkout?.date).toEqual(new Date(2021, 0, 1));
    expect(result.current.currentWorkout?.loggedExercises).toEqual([]);
    expect(result.current.currentWorkout?.programId).toBeUndefined();
  });

  // Test 3: Start Program Workout
  it('should start a workout from a program', async () => {
    // Mock getItem *before* renderHook
    programGetItemMock.mockResolvedValueOnce(mockProgramsData[0]);
        
    const { result } = renderHook(() => useWorkout());
    
    expect(result.current.currentWorkout).toBeNull(); // Verify initial state

    await act(async () => {
      await result.current.startProgramWorkout('prog1');
    });

    // Check the state via result.current
    expect(result.current.currentWorkout).not.toBeNull();
    expect(result.current.currentWorkout?.programId).toBe('prog1');
    expect(result.current.currentWorkout?.loggedExercises.length).toBe(1);
    expect(result.current.currentWorkout?.loggedExercises[0].exerciseId).toBe('ex1');
    expect(result.current.currentWorkout?.date).toEqual(new Date(2021, 0, 1));
  });

  // Test 4: Add Exercise
  it('should add an exercise to the workout', () => {
    const { result } = renderHook(() => useWorkout());

    // Start a workout first
    act(() => {
      result.current.startWorkout();
    });

    const initialWorkout = result.current.currentWorkout;
    expect(initialWorkout?.loggedExercises.length).toBe(0);

    // Add an exercise
    act(() => {
      result.current.addExerciseToWorkout('ex1');
    });
    
    // Verify
    expect(result.current.currentWorkout?.loggedExercises.length).toBe(1);
    expect(result.current.currentWorkout?.loggedExercises[0].exerciseId).toBe('ex1');
    expect(result.current.currentWorkout?.loggedExercises[0].sets).toEqual([]);
  });

  // Test 5: Log Set
  it('should log a set for an exercise', () => {
    const { result } = renderHook(() => useWorkout());
    
    // Start workout and add an exercise
    act(() => {
      result.current.startWorkout();
      result.current.addExerciseToWorkout('ex1');
    });

    expect(result.current.currentWorkout?.loggedExercises[0]?.sets.length).toBe(0);

    // Log a set
    const setData = { weight: 100, reps: 5 };
    act(() => {
      result.current.logSet(0, setData);
    });
    
    // Verify
    expect(result.current.currentWorkout?.loggedExercises[0]?.sets.length).toBe(1);
    expect(result.current.currentWorkout?.loggedExercises[0]?.sets[0]).toEqual(setData);
  });

  // Test 6: Delete Set
  it('should delete a set from an exercise', () => {
    const { result } = renderHook(() => useWorkout());
    
    // Start, add exercise, log two sets
    const set1 = { weight: 100, reps: 5 };
    const set2 = { weight: 110, reps: 5 };
    act(() => {
      result.current.startWorkout();
      result.current.addExerciseToWorkout('ex1');
      result.current.logSet(0, set1);
      result.current.logSet(0, set2);
    });

    expect(result.current.currentWorkout?.loggedExercises[0]?.sets.length).toBe(2);
    
    // Delete the first set (index 0)
    act(() => {
      result.current.deleteSet(0, 0);
    });
    
    // Verify
    expect(result.current.currentWorkout?.loggedExercises[0]?.sets.length).toBe(1);
    expect(result.current.currentWorkout?.loggedExercises[0]?.sets[0]).toEqual(set2); // Remaining set is set2
  });

  // Test 7: Finish Workout
  it('should finish the workout and save it', async () => {
    const { result } = renderHook(() => useWorkout());

    // Start, add exercise, log set
    act(() => {
      result.current.startWorkout();
      result.current.addExerciseToWorkout('ex1');
      result.current.logSet(0, { weight: 100, reps: 5 });
    });

    const workoutToSave = result.current.currentWorkout;
    expect(workoutToSave).not.toBeNull();

    await act(async () => {
      await result.current.finishWorkout();
    });

    // Verify state is reset
    expect(result.current.currentWorkout).toBeNull();
    expect(result.current.activeExerciseIndex).toBe(0);

    // Verify the specific saveItem mock for WORKOUT_LOGS was called
    expect(workoutLogSaveItemMock).toHaveBeenCalledTimes(1);
    expect(workoutLogSaveItemMock).toHaveBeenCalledWith(workoutToSave);
    expect(programGetItemMock).not.toHaveBeenCalled(); // Ensure other store mocks weren't called
  });

  // Test for saving a workout with exercises that have no sets
  it('should preserve exercises with no sets when finishing a workout', async () => {
    const { result } = renderHook(() => useWorkout());
    
    // Start a new workout
    act(() => {
      result.current.startWorkout();
    });
    
    // Verify workout is created
    expect(result.current.currentWorkout).not.toBeNull();
    
    // Add exercises one by one (this updates the state properly)
    act(() => {
      // First add 'ex1'
      result.current.addExerciseToWorkout('ex1');
    });
    
    act(() => {
      // Then add 'ex2'
      result.current.addExerciseToWorkout('ex2');
    });
    
    // Get the workout with the exercises
    const workoutWithExercises = result.current.currentWorkout;
    
    // Verify both exercises are added
    expect(workoutWithExercises?.loggedExercises.length).toBe(2);
    expect(workoutWithExercises?.loggedExercises[0].exerciseId).toBe('ex1');
    expect(workoutWithExercises?.loggedExercises[1].exerciseId).toBe('ex2');
    
    // Finish the workout
    await act(async () => {
      await result.current.finishWorkout();
    });
    
    // Verify saveWorkoutLog was called with the correct data
    expect(workoutLogSaveItemMock).toHaveBeenCalledTimes(1);
    const savedWorkout = workoutLogSaveItemMock.mock.calls[0][0];
    
    // Check that both exercises were preserved in the saved workout
    expect(savedWorkout.loggedExercises.length).toBe(2);
    expect(savedWorkout.loggedExercises[0].exerciseId).toBe('ex1');
    expect(savedWorkout.loggedExercises[1].exerciseId).toBe('ex2');
  });

  // Test 8: Navigation
  describe('exercise navigation', () => {
    beforeEach(() => {
      // Start a workout with multiple exercises for navigation tests
      const { result } = renderHook(() => useWorkout());
      act(() => {
        result.current.startWorkout();
        result.current.addExerciseToWorkout('ex1');
        result.current.addExerciseToWorkout('ex2');
      });
      // Need to share the result or re-render for each navigation test
    });

    it('should navigate to next exercise', () => {
       const { result } = renderHook(() => useWorkout());
       // Pre-populate state for the test
       act(() => {
         result.current.startWorkout();
         result.current.addExerciseToWorkout('ex1');
         result.current.addExerciseToWorkout('ex2');
       });

       expect(result.current.activeExerciseIndex).toBe(0);

       act(() => {
         result.current.nextExercise();
       });

       expect(result.current.activeExerciseIndex).toBe(1);

       // Try navigating past the end
       act(() => {
         result.current.nextExercise();
       });
       expect(result.current.activeExerciseIndex).toBe(1); // Should not change
    });

    it('should navigate to previous exercise', () => {
       const { result } = renderHook(() => useWorkout());
       // Pre-populate state for the test
       act(() => {
         result.current.startWorkout();
         result.current.addExerciseToWorkout('ex1');
         result.current.addExerciseToWorkout('ex2');
         result.current.nextExercise(); // Move to index 1
       });
       
       expect(result.current.activeExerciseIndex).toBe(1);

       act(() => {
         result.current.previousExercise();
       });

       expect(result.current.activeExerciseIndex).toBe(0);

       // Try navigating before the beginning
       act(() => {
         result.current.previousExercise();
       });
       expect(result.current.activeExerciseIndex).toBe(0); // Should not change
    });

    // Test 9: Active Exercise
    it('should return the active exercise details', () => {
       const { result } = renderHook(() => useWorkout());
       // Pre-populate state for the test
       act(() => {
         result.current.startWorkout();
         result.current.addExerciseToWorkout('ex1');
         result.current.addExerciseToWorkout('ex2');
       });
       
       expect(result.current.activeExercise?.exerciseId).toBe('ex1');

       act(() => {
         result.current.nextExercise();
       });

       expect(result.current.activeExercise?.exerciseId).toBe('ex2');
    });

    it('should return undefined active exercise if workout is null', () => {
      const { result } = renderHook(() => useWorkout());
      // No workout started
      expect(result.current.activeExercise).toBeUndefined();
    });

    it('should return undefined active exercise if index is out of bounds', () => {
       const { result } = renderHook(() => useWorkout());
       // Start workout but don't add exercises
       act(() => {
         result.current.startWorkout();
       });
       expect(result.current.activeExercise).toBeUndefined();
    });
  });
}); 