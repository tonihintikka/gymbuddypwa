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
    if (!currentWorkout) return false;
    const newLoggedExercise: LoggedExercise = {
      exerciseId,
      sets: [],
    };
    setCurrentWorkout(prev => prev ? {
      ...prev,
      loggedExercises: [...prev.loggedExercises, newLoggedExercise],
    } : null);
    setActiveExerciseIndex(currentWorkout.loggedExercises.length);
    return true;
  }, [currentWorkout]);

  const logSet = useCallback((exerciseIndex: number, setLog: SetLog) => {
    if (!currentWorkout) return false;
    const updatedExercises = [...currentWorkout.loggedExercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: [...updatedExercises[exerciseIndex].sets, setLog],
    };
    setCurrentWorkout(prev => prev ? { ...prev, loggedExercises: updatedExercises } : null);
    return true;
  }, [currentWorkout]);

  const deleteSet = useCallback((exerciseIndex: number, setIndex: number) => {
    if (!currentWorkout) return false;
    const updatedExercises = [...currentWorkout.loggedExercises];
    const updatedSets = [...updatedExercises[exerciseIndex].sets];
    updatedSets.splice(setIndex, 1);
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: updatedSets,
    };
    setCurrentWorkout(prev => prev ? { ...prev, loggedExercises: updatedExercises } : null);
    return true;
  }, [currentWorkout]);

  const finishWorkout = useCallback(async () => {
    if (!currentWorkout) return false;
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

  const nextExercise = useCallback(() => {
    if (!currentWorkout || activeExerciseIndex >= currentWorkout.loggedExercises.length - 1) return false;
    setActiveExerciseIndex(prev => prev + 1);
    return true;
  }, [currentWorkout, activeExerciseIndex]);

  const previousExercise = useCallback(() => {
    if (!currentWorkout || activeExerciseIndex <= 0) return false;
    setActiveExerciseIndex(prev => prev - 1);
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
