/**
 * Custom hook for managing active workouts
 */
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { WorkoutLog, LoggedExercise, SetLog, Program } from '../../../types/models';
import { STORES } from '../../../services/db';

export function useWorkout() {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutLog | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  
  const { saveItem: saveWorkoutLog } = useIndexedDB<WorkoutLog>(STORES.WORKOUT_LOGS);
  const { getItem: getProgram } = useIndexedDB<Program>(STORES.PROGRAMS);

  // Start a new workout
  const startWorkout = useCallback((programId?: string) => {
    const newWorkout: WorkoutLog = {
      id: uuidv4(),
      date: new Date(),
      loggedExercises: [],
      programId,
    };
    
    setCurrentWorkout(newWorkout);
    setActiveExerciseIndex(0);
    
    return newWorkout;
  }, []);

  // Start a workout from a program
  const startProgramWorkout = useCallback(async (programId: string) => {
    const program = await getProgram(programId);
    
    if (!program) {
      return null;
    }
    
    const newWorkout = startWorkout(programId);
    
    // Initialize logged exercises from program
    const loggedExercises: LoggedExercise[] = program.exercises.map(exercise => ({
      exerciseId: exercise.exerciseId,
      sets: [],
    }));
    
    setCurrentWorkout({
      ...newWorkout,
      loggedExercises,
    });
    
    return newWorkout;
  }, [getProgram, startWorkout]);

  // Add an exercise to the current workout
  const addExerciseToWorkout = useCallback((exerciseId: string) => {
    if (!currentWorkout) {
      return false;
    }
    
    const newLoggedExercise: LoggedExercise = {
      exerciseId,
      sets: [],
    };
    
    setCurrentWorkout({
      ...currentWorkout,
      loggedExercises: [...currentWorkout.loggedExercises, newLoggedExercise],
    });
    
    return true;
  }, [currentWorkout]);

  // Log a set for the active exercise
  const logSet = useCallback((
    weight: number, 
    reps: number, 
    isFailure?: boolean,
    isPaused?: boolean,
    isSlowEccentric?: boolean
  ) => {
    if (!currentWorkout || activeExerciseIndex >= currentWorkout.loggedExercises.length) {
      return false;
    }
    
    const newSet: SetLog = {
      weight,
      reps,
      isFailure,
      isPaused,
      isSlowEccentric,
    };
    
    const updatedExercises = [...currentWorkout.loggedExercises];
    updatedExercises[activeExerciseIndex] = {
      ...updatedExercises[activeExerciseIndex],
      sets: [...updatedExercises[activeExerciseIndex].sets, newSet],
    };
    
    setCurrentWorkout({
      ...currentWorkout,
      loggedExercises: updatedExercises,
    });
    
    return true;
  }, [currentWorkout, activeExerciseIndex]);

  // Finish the current workout and save it
  const finishWorkout = useCallback(async () => {
    if (!currentWorkout) {
      return false;
    }
    
    try {
      await saveWorkoutLog(currentWorkout);
      setCurrentWorkout(null);
      setActiveExerciseIndex(0);
      return true;
    } catch (error) {
      console.error('Error saving workout:', error);
      return false;
    }
  }, [currentWorkout, saveWorkoutLog]);

  // Navigate to the next exercise
  const nextExercise = useCallback(() => {
    if (!currentWorkout || activeExerciseIndex >= currentWorkout.loggedExercises.length - 1) {
      return false;
    }
    
    setActiveExerciseIndex(activeExerciseIndex + 1);
    return true;
  }, [currentWorkout, activeExerciseIndex]);

  // Navigate to the previous exercise
  const previousExercise = useCallback(() => {
    if (!currentWorkout || activeExerciseIndex <= 0) {
      return false;
    }
    
    setActiveExerciseIndex(activeExerciseIndex - 1);
    return true;
  }, [currentWorkout, activeExerciseIndex]);

  return {
    currentWorkout,
    activeExerciseIndex,
    activeExercise: currentWorkout?.loggedExercises[activeExerciseIndex],
    startWorkout,
    startProgramWorkout,
    addExerciseToWorkout,
    logSet,
    finishWorkout,
    nextExercise,
    previousExercise,
  };
}
