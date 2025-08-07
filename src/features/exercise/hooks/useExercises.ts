/**
 * Custom hook for managing exercises
 */
import { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { Exercise } from '../../../types/models';
import { STORES } from '../../../services/db';

// Built-in exercises
    const defaultExercises: Exercise[] = [
      // Chest
      { id: 'bench-press', name: 'Bench Press', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Bench Press' },
      { id: 'incline-bench-press', name: 'Incline Bench Press', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Bench Press' },
      { id: 'decline-bench-press', name: 'Decline Bench Press', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Bench Press' },
      { id: 'dumbbell-bench-press', name: 'Dumbbell Bench Press', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Bench Press' },
      { id: 'push-up', name: 'Push-up', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Push-up' },
      { id: 'dips', name: 'Dips', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Dips' },

      // Back
      { id: 'pull-up', name: 'Pull-up', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Pull-up' },
      { id: 'chin-up', name: 'Chin-up', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Pull-up' },
      { id: 'lat-pulldown', name: 'Lat Pulldown', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Lat Pulldown' },
      { id: 'barbell-row', name: 'Barbell Row', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Row' },
      { id: 'dumbbell-row', name: 'Dumbbell Row', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Row' },
      { id: 'deadlift', name: 'Deadlift', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Deadlift' },
      { id: 'romanian-deadlift', name: 'Romanian Deadlift', isCustom: false, muscleGroup: 'Hamstrings', category: 'Pull', side: 'Back', baseExercise: 'Deadlift' },
      { id: 'sumo-deadlift', name: 'Sumo Deadlift', isCustom: false, muscleGroup: 'Glutes', category: 'Pull', side: 'Back', baseExercise: 'Deadlift' },

      // Shoulders
      { id: 'overhead-press', name: 'Overhead Press', isCustom: false, muscleGroup: 'Shoulders', category: 'Push', side: 'Front', baseExercise: 'Overhead Press' },
      { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', isCustom: false, muscleGroup: 'Shoulders', category: 'Push', side: 'Front', baseExercise: 'Overhead Press' },
      { id: 'lateral-raise', name: 'Lateral Raise', isCustom: false, muscleGroup: 'Shoulders', category: 'Push', side: 'Front', baseExercise: 'Lateral Raise' },
      { id: 'front-raise', name: 'Front Raise', isCustom: false, muscleGroup: 'Shoulders', category: 'Push', side: 'Front', baseExercise: 'Front Raise' },
      { id: 'face-pull', name: 'Face Pull', isCustom: false, muscleGroup: 'Shoulders', category: 'Pull', side: 'Back', baseExercise: 'Face Pull' },

      // Biceps
      { id: 'barbell-curl', name: 'Barbell Curl', isCustom: false, muscleGroup: 'Biceps', category: 'Pull', side: 'Front', baseExercise: 'Curl' },
      { id: 'dumbbell-curl', name: 'Dumbbell Curl', isCustom: false, muscleGroup: 'Biceps', category: 'Pull', side: 'Front', baseExercise: 'Curl' },
      { id: 'hammer-curl', name: 'Hammer Curl', isCustom: false, muscleGroup: 'Biceps', category: 'Pull', side: 'Front', baseExercise: 'Curl' },
      { id: 'preacher-curl', name: 'Preacher Curl', isCustom: false, muscleGroup: 'Biceps', category: 'Pull', side: 'Front', baseExercise: 'Curl' },

      // Triceps
      { id: 'tricep-pushdown', name: 'Tricep Pushdown', isCustom: false, muscleGroup: 'Triceps', category: 'Push', side: 'Back', baseExercise: 'Tricep Extension' },
      { id: 'skull-crusher', name: 'Skull Crusher', isCustom: false, muscleGroup: 'Triceps', category: 'Push', side: 'Back', baseExercise: 'Tricep Extension' },
      { id: 'close-grip-bench-press', name: 'Close-Grip Bench Press', isCustom: false, muscleGroup: 'Triceps', category: 'Push', side: 'Front', baseExercise: 'Bench Press' },
      { id: 'tricep-dips', name: 'Tricep Dips', isCustom: false, muscleGroup: 'Triceps', category: 'Push', side: 'Back', baseExercise: 'Dips' },

      // Legs
      { id: 'squat', name: 'Squat', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Squat' },
      { id: 'front-squat', name: 'Front Squat', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Squat' },
      { id: 'goblet-squat', name: 'Goblet Squat', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Squat' },
      { id: 'lunge', name: 'Lunge', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Lunge' },
      { id: 'leg-press', name: 'Leg Press', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Leg Press' },
      { id: 'leg-curl', name: 'Leg Curl', isCustom: false, muscleGroup: 'Hamstrings', category: 'Legs', side: 'Back', baseExercise: 'Leg Curl' },
      { id: 'leg-extension', name: 'Leg Extension', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Leg Extension' },
      { id: 'calf-raise', name: 'Calf Raise', isCustom: false, muscleGroup: 'Calves', category: 'Legs', side: 'Back', baseExercise: 'Calf Raise' },
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
  const allExercises = useMemo(() => 
    [...defaultExercises, ...customExercises], 
    [customExercises]
  );

  // Add a new custom exercise
  const addExercise = useCallback(async (exercise: Omit<Exercise, 'id' | 'isCustom'>) => {
    if (!exercise.name.trim()) {
      return false;
    }

    const newExercise: Exercise = {
      ...exercise,
      id: uuidv4(),
      name: exercise.name.trim(),
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
    builtInExercises: defaultExercises,
    loading,
    error,
    addExercise,
    removeExercise,
  };
}
