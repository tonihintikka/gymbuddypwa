import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWorkout } from '../hooks/useWorkout';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { useExercises } from '../../exercise/hooks/useExercises';
import { usePrograms } from '../../program/hooks/usePrograms';
import { Exercise, Program, ProgramExercise } from '../../../types/models'; // Import necessary types

// Mock dependencies
vi.mock('../../../hooks/useIndexedDB', () => ({
  useIndexedDB: vi.fn(),
}));

vi.mock('../../exercise/hooks/useExercises', () => ({
  useExercises: vi.fn(),
}));

vi.mock('../../program/hooks/usePrograms', () => ({
  usePrograms: vi.fn(),
}));

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

// --- Removed React.useState mock ---

describe('useWorkout', () => {
  // Setup mock functions and data
  const saveItemMock = vi.fn().mockResolvedValue(true);
  const getItemMock = vi.fn();
  const loadItemsMock = vi.fn().mockResolvedValue(undefined);
  const deleteItemMock = vi.fn().mockResolvedValue(true);

  // Corrected mockExercises to match Exercise interface
  const mockExercises: Exercise[] = [
    { id: 'ex1', name: 'Squat', isCustom: false },
    { id: 'ex2', name: 'Bench Press', isCustom: false },
  ];

  // Corrected mockPrograms to match Program interface
  const mockPrograms: Program[] = [
    { 
      id: 'prog1', 
      name: 'Strength Program', 
      exercises: [
        { exerciseId: 'ex1', targetSets: 3, targetReps: '5' } as ProgramExercise
      ] 
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset the mock implementations with vi.mocked and complete interfaces
    vi.mocked(useIndexedDB).mockReturnValue({
      saveItem: saveItemMock,
      getItem: getItemMock,
      loadItems: loadItemsMock,
      deleteItem: deleteItemMock,
      items: [], // Add missing properties
      loading: false,
      error: null,
    });
    
    vi.mocked(useExercises).mockReturnValue({
      exercises: mockExercises,
      addExercise: vi.fn(), // Add missing functions
      removeExercise: vi.fn(),
      customExercises: [],
      builtInExercises: [],
      loading: false,
      error: null,
    });
    
    vi.mocked(usePrograms).mockReturnValue({
      programs: mockPrograms,
      createProgram: vi.fn(), // Add missing functions
      addExerciseToProgram: vi.fn(),
      deleteProgram: vi.fn(),
      removeExerciseFromProgram: vi.fn(),
      customPrograms: [],
      builtInPrograms: [],
      loading: false,
      error: null,
    });
    
    // Make Date.now() return a consistent value for testing
    // Ensure we restore the original Date.now after each test if needed, or spy per test.
    // vi.spyOn(Date, 'now').mockImplementation(() => 1609459200000); // 2021-01-01
  });

  // Test 1: Initialization
  it('should initialize with null currentWorkout', () => {
    const { result } = renderHook(() => useWorkout());
    
    expect(result.current.currentWorkout).toBeNull();
    expect(result.current.activeExerciseIndex).toBe(0);
  });

  // Test 2: Start Empty Workout
  it('should start a new empty workout', () => {
    const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => 1609459200000);
    const { result } = renderHook(() => useWorkout());
    
    expect(result.current.currentWorkout).toBeNull(); // Verify initial state

    act(() => {
      result.current.startWorkout();
    });
    
    // Check the state via result.current
    expect(result.current.currentWorkout).not.toBeNull();
    expect(result.current.currentWorkout?.id).toBe('mock-uuid');
    expect(result.current.currentWorkout?.date).toEqual(new Date(1609459200000));
    expect(result.current.currentWorkout?.loggedExercises).toEqual([]);
    expect(result.current.currentWorkout?.programId).toBeUndefined();

    dateSpy.mockRestore(); // Restore original Date.now
  });

  // Test 3: Start Program Workout
  it('should start a workout from a program', async () => {
    const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => 1609459200000);
    // Mock the getItem to return a program
    getItemMock.mockResolvedValueOnce(mockPrograms[0]);
        
    const { result } = renderHook(() => useWorkout());
    
    expect(result.current.currentWorkout).toBeNull(); // Verify initial state

    // Call the function within act
    await act(async () => {
      await result.current.startProgramWorkout('prog1');
    });
    
    // Check the state via result.current
    expect(result.current.currentWorkout).not.toBeNull();
    expect(result.current.currentWorkout?.programId).toBe('prog1');
    expect(result.current.currentWorkout?.loggedExercises.length).toBe(1);
    expect(result.current.currentWorkout?.loggedExercises[0].exerciseId).toBe('ex1');
    expect(result.current.currentWorkout?.date).toEqual(new Date(1609459200000));

    dateSpy.mockRestore();
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

    // Verify saveItem was called with the correct data
    expect(saveItemMock).toHaveBeenCalledTimes(1);
    // We expect the workout log to be saved to the WORKOUT_LOGS store
    expect(vi.mocked(useIndexedDB).mock.calls[0][0]).toBe('WORKOUT_LOGS'); // Check store name passed to useIndexedDB
    expect(saveItemMock).toHaveBeenCalledWith(workoutToSave); 
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