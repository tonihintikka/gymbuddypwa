/**
 * Custom hook for managing workout programs
 */
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { Program, ProgramExercise } from '../../../types/models';
import { STORES } from '../../../services/db';

export function usePrograms() {
  const { 
    items: programs, 
    loading, 
    error, 
    saveItem, 
    getItem,
    deleteItem 
  } = useIndexedDB<Program>(STORES.PROGRAMS);

  // Create a new program
  const createProgram = useCallback(async (name: string, description?: string) => {
    if (!name.trim()) {
      return false;
    }

    const newProgram: Program = {
      id: uuidv4(),
      name: name.trim(),
      description: description?.trim(),
      exercises: [],
    };

    return await saveItem(newProgram);
  }, [saveItem]);

  // Add an exercise to a program
  const addExerciseToProgram = useCallback(async (
    programId: string, 
    exerciseId: string, 
    targetSets?: number, 
    targetReps?: string,
    notes?: string
  ) => {
    const program = await getItem(programId);
    
    if (!program) {
      return false;
    }

    const programExercise: ProgramExercise = {
      exerciseId,
      targetSets,
      targetReps,
      notes,
    };

    const updatedProgram: Program = {
      ...program,
      exercises: [...program.exercises, programExercise],
    };

    return await saveItem(updatedProgram);
  }, [getItem, saveItem]);

  // Remove an exercise from a program
  const removeExerciseFromProgram = useCallback(async (
    programId: string,
    exerciseIndex: number
  ) => {
    const program = await getItem(programId);
    
    if (!program) {
      return false;
    }

    const updatedExercises = [...program.exercises];
    updatedExercises.splice(exerciseIndex, 1);

    const updatedProgram: Program = {
      ...program,
      exercises: updatedExercises,
    };

    return await saveItem(updatedProgram);
  }, [getItem, saveItem]);

  // Delete a program
  const deleteProgram = useCallback(async (id: string) => {
    return await deleteItem(id);
  }, [deleteItem]);

  return {
    programs,
    loading,
    error,
    createProgram,
    addExerciseToProgram,
    removeExerciseFromProgram,
    deleteProgram,
  };
}
