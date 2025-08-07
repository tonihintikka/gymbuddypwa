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

  const startProgramWorkout = useCallback(async (programId: string) => {
    const program = await getProgram(programId);
    if (!program) {
      console.error("Program not found with ID:", programId);
      return null;
    }
    const newWorkout = startWorkout(programId);
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

  const addExerciseToWorkout = useCallback((exerciseId: string) => {
    setCurrentWorkout(prev => {
      if (!prev) return null;
      const newLoggedExercise: LoggedExercise = {
        exerciseId,
        sets: [],
      };
      setActiveExerciseIndex(prev.loggedExercises.length);
      return {
        ...prev,
        loggedExercises: [...prev.loggedExercises, newLoggedExercise],
      };
    });
    return true;
  }, []);

  const logSet = useCallback((exerciseIndex: number, setLog: SetLog) => {
    setCurrentWorkout(prev => {
      if (!prev) return null;
      const updatedExercises = [...prev.loggedExercises];
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        sets: [...updatedExercises[exerciseIndex].sets, setLog],
      };
      return { ...prev, loggedExercises: updatedExercises };
    });
    return true;
  }, []);

  const deleteSet = useCallback((exerciseIndex: number, setIndex: number) => {
    setCurrentWorkout(prev => {
      if (!prev) return null;
      const updatedExercises = [...prev.loggedExercises];
      const updatedSets = [...updatedExercises[exerciseIndex].sets];
      updatedSets.splice(setIndex, 1);
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        sets: updatedSets,
      };
      return { ...prev, loggedExercises: updatedExercises };
    });
    return true;
  }, []);

  const finishWorkout = useCallback(async () => {
    let workoutToSave: WorkoutLog | null = null;
    setCurrentWorkout(prev => {
      workoutToSave = prev;
      return null;
    });

    if (!workoutToSave) return false;
    try {
      await saveWorkoutLog(workoutToSave);
      setActiveExerciseIndex(0);
      return true;
    } catch (error) {
      console.error('Error saving workout:', error);
      // Optionally, revert state if save fails
      setCurrentWorkout(workoutToSave);
      return false;
    }
  }, [saveWorkoutLog]);

  const nextExercise = useCallback(() => {
    setActiveExerciseIndex(prev => {
      let nextIndex = prev + 1;
      if (currentWorkout && nextIndex >= currentWorkout.loggedExercises.length) {
        nextIndex = currentWorkout.loggedExercises.length - 1;
      }
      return nextIndex;
    });
    return true;
  }, [currentWorkout]);

  const previousExercise = useCallback(() => {
    setActiveExerciseIndex(prev => {
      const nextIndex = prev - 1;
      if (nextIndex < 0) {
        return 0;
      }
      return nextIndex;
    });
    return true;
  }, []);

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
