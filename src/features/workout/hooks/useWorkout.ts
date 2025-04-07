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
    console.log("startProgramWorkout called with programId:", programId);
    const program = await getProgram(programId);
    console.log("Retrieved program:", program);

    if (!program) {
      console.error("Program not found with ID:", programId);
      return null;
    }

    const newWorkout = startWorkout(programId);
    console.log("Started new workout:", newWorkout);

    // Initialize logged exercises from program
    const loggedExercises: LoggedExercise[] = program.exercises.map(exercise => ({
      exerciseId: exercise.exerciseId,
      sets: [],
    }));
    console.log("Created logged exercises:", loggedExercises);

    setCurrentWorkout({
      ...newWorkout,
      loggedExercises,
    });
    console.log("Set current workout with exercises");

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

    // Set active exercise to the newly added exercise
    setActiveExerciseIndex(currentWorkout.loggedExercises.length);

    return true;
  }, [currentWorkout]);

  // Log a set for a specific exercise
  const logSet = useCallback((exerciseIndex: number, setLog: SetLog) => {
    if (!currentWorkout || exerciseIndex >= currentWorkout.loggedExercises.length) {
      return false;
    }

    const updatedExercises = [...currentWorkout.loggedExercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: [...updatedExercises[exerciseIndex].sets, setLog],
    };

    setCurrentWorkout({
      ...currentWorkout,
      loggedExercises: updatedExercises,
    });

    return true;
  }, [currentWorkout]);

  // Delete a set from a specific exercise
  const deleteSet = useCallback((exerciseIndex: number, setIndex: number) => {
    if (
      !currentWorkout ||
      exerciseIndex >= currentWorkout.loggedExercises.length ||
      setIndex >= currentWorkout.loggedExercises[exerciseIndex].sets.length
    ) {
      return false;
    }

    const updatedExercises = [...currentWorkout.loggedExercises];
    const updatedSets = [...updatedExercises[exerciseIndex].sets];
    updatedSets.splice(setIndex, 1);

    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: updatedSets,
    };

    setCurrentWorkout({
      ...currentWorkout,
      loggedExercises: updatedExercises,
    });

    return true;
  }, [currentWorkout]);

  // Finish the current workout and save it
  const finishWorkout = useCallback(async () => {
    if (!currentWorkout) {
      return false;
    }

    try {
      // Filter out any exercises with no sets logged
      const filteredExercises = currentWorkout.loggedExercises.filter(
        exercise => exercise.sets.length > 0
      );

      const finalWorkout = {
        ...currentWorkout,
        loggedExercises: filteredExercises,
      };

      await saveWorkoutLog(finalWorkout);
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
    deleteSet,
    finishWorkout,
    nextExercise,
    previousExercise,
  };
}
