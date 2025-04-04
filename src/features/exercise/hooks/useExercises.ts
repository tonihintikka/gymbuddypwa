/**
 * Custom hook for managing exercises
 */
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { Exercise } from '../../../types/models';
import { STORES } from '../../../services/db';

// Built-in exercises
const builtInExercises: Exercise[] = [
  { id: 'squat', name: 'Squat', isCustom: false },
  { id: 'bench-press', name: 'Bench Press', isCustom: false },
  { id: 'deadlift', name: 'Deadlift', isCustom: false },
  { id: 'overhead-press', name: 'Overhead Press', isCustom: false },
  { id: 'barbell-row', name: 'Barbell Row', isCustom: false },
];

export function useExercises() {
  const { 
    items: customExercises, 
    loading, 
    error, 
    saveItem, 
    deleteItem 
  } = useIndexedDB<Exercise>(STORES.EXERCISES);

  // Combine built-in and custom exercises
  const allExercises = [...builtInExercises, ...customExercises];

  // Add a new custom exercise
  const addExercise = useCallback(async (name: string) => {
    if (!name.trim()) {
      return false;
    }

    const newExercise: Exercise = {
      id: uuidv4(),
      name: name.trim(),
      isCustom: true,
    };

    return await saveItem(newExercise);
  }, [saveItem]);

  // Delete a custom exercise
  const removeExercise = useCallback(async (id: string) => {
    const exercise = allExercises.find(ex => ex.id === id);
    
    if (!exercise || !exercise.isCustom) {
      return false;
    }

    return await deleteItem(id);
  }, [allExercises, deleteItem]);

  return {
    exercises: allExercises,
    customExercises,
    builtInExercises,
    loading,
    error,
    addExercise,
    removeExercise,
  };
}
