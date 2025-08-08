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
      { id: 'incline-dumbbell-bench-press', name: 'Incline Dumbbell Bench Press', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Bench Press' },
      { id: 'dumbbell-fly', name: 'Dumbbell Fly', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Fly' },
      { id: 'cable-fly', name: 'Cable Fly', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Fly' },
      { id: 'smith-bench-press', name: 'Smith Bench Press', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Bench Press' },
      { id: 'smith-incline-bench-press', name: 'Smith Incline Bench Press', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Bench Press' },
      { id: 'push-up', name: 'Push-up', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Push-up' },
      { id: 'push-ups', name: 'Push-ups', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Push-up' },
      { id: 'dips', name: 'Dips', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Dips' },

      // Back
      { id: 'pull-up', name: 'Pull-up', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Pull-up' },
      { id: 'pull-ups', name: 'Pull-ups', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Pull-up' },
      { id: 'chin-up', name: 'Chin-up', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Pull-up' },
      { id: 'lat-pulldown', name: 'Lat Pulldown', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Lat Pulldown' },
      { id: 'barbell-row', name: 'Barbell Row', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Row' },
      { id: 'dumbbell-row', name: 'Dumbbell Row', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Row' },
      { id: 'seated-cable-row', name: 'Seated Cable Row', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Row' },
      { id: 'deadlift', name: 'Deadlift', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Deadlift' },
      { id: 'romanian-deadlift', name: 'Romanian Deadlift', isCustom: false, muscleGroup: 'Hamstrings', category: 'Pull', side: 'Back', baseExercise: 'Deadlift' },
      { id: 'sumo-deadlift', name: 'Sumo Deadlift', isCustom: false, muscleGroup: 'Glutes', category: 'Pull', side: 'Back', baseExercise: 'Deadlift' },
      { id: 'smith-row', name: 'Smith Bent-over Row', isCustom: false, muscleGroup: 'Back', category: 'Pull', side: 'Back', baseExercise: 'Row' },

      // Shoulders
      { id: 'overhead-press', name: 'Overhead Press', isCustom: false, muscleGroup: 'Shoulders', category: 'Push', side: 'Front', baseExercise: 'Overhead Press' },
      { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', isCustom: false, muscleGroup: 'Shoulders', category: 'Push', side: 'Front', baseExercise: 'Overhead Press' },
      { id: 'lateral-raise', name: 'Lateral Raise', isCustom: false, muscleGroup: 'Shoulders', category: 'Push', side: 'Front', baseExercise: 'Lateral Raise' },
      { id: 'front-raise', name: 'Front Raise', isCustom: false, muscleGroup: 'Shoulders', category: 'Push', side: 'Front', baseExercise: 'Front Raise' },
      { id: 'dumbbell-front-raise', name: 'Dumbbell Front Raise', isCustom: false, muscleGroup: 'Shoulders', category: 'Push', side: 'Front', baseExercise: 'Front Raise' },
      { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', isCustom: false, muscleGroup: 'Shoulders', category: 'Push', side: 'Front', baseExercise: 'Lateral Raise' },
      { id: 'smith-shoulder-press', name: 'Smith Shoulder Press', isCustom: false, muscleGroup: 'Shoulders', category: 'Push', side: 'Front', baseExercise: 'Overhead Press' },
      { id: 'face-pull', name: 'Face Pull', isCustom: false, muscleGroup: 'Shoulders', category: 'Pull', side: 'Back', baseExercise: 'Face Pull' },
      { id: 'cable-face-pull', name: 'Cable Face Pull', isCustom: false, muscleGroup: 'Shoulders', category: 'Pull', side: 'Back', baseExercise: 'Face Pull' },
      { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', isCustom: false, muscleGroup: 'Chest', category: 'Push', side: 'Front', baseExercise: 'Incline Dumbbell Press' },

      // Biceps
      { id: 'barbell-curl', name: 'Barbell Curl', isCustom: false, muscleGroup: 'Biceps', category: 'Pull', side: 'Front', baseExercise: 'Curl' },
      { id: 'dumbbell-curl', name: 'Dumbbell Curl', isCustom: false, muscleGroup: 'Biceps', category: 'Pull', side: 'Front', baseExercise: 'Curl' },
      { id: 'hammer-curl', name: 'Hammer Curl', isCustom: false, muscleGroup: 'Biceps', category: 'Pull', side: 'Front', baseExercise: 'Curl' },
      { id: 'preacher-curl', name: 'Preacher Curl', isCustom: false, muscleGroup: 'Biceps', category: 'Pull', side: 'Front', baseExercise: 'Curl' },
      { id: 'cable-curl', name: 'Cable Curl', isCustom: false, muscleGroup: 'Biceps', category: 'Pull', side: 'Front', baseExercise: 'Curl' },

      // Triceps
      { id: 'tricep-pushdown', name: 'Tricep Pushdown', isCustom: false, muscleGroup: 'Triceps', category: 'Push', side: 'Back', baseExercise: 'Tricep Extension' },
      { id: 'skull-crusher', name: 'Skull Crusher', isCustom: false, muscleGroup: 'Triceps', category: 'Push', side: 'Back', baseExercise: 'Tricep Extension' },
      { id: 'dumbbell-skull-crusher', name: 'Dumbbell Skull Crusher', isCustom: false, muscleGroup: 'Triceps', category: 'Push', side: 'Back', baseExercise: 'Tricep Extension' },
      { id: 'close-grip-bench-press', name: 'Close-Grip Bench Press', isCustom: false, muscleGroup: 'Triceps', category: 'Push', side: 'Front', baseExercise: 'Bench Press' },
      { id: 'tricep-dips', name: 'Tricep Dips', isCustom: false, muscleGroup: 'Triceps', category: 'Push', side: 'Back', baseExercise: 'Dips' },
      { id: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', isCustom: false, muscleGroup: 'Triceps', category: 'Push', side: 'Back', baseExercise: 'Tricep Extension' },
      { id: 'rope-tricep-pushdown', name: 'Rope Tricep Pushdown', isCustom: false, muscleGroup: 'Triceps', category: 'Push', side: 'Back', baseExercise: 'Tricep Extension' },

      // Legs
      { id: 'squat', name: 'Squat', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Squat' },
      { id: 'front-squat', name: 'Front Squat', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Squat' },
      { id: 'goblet-squat', name: 'Goblet Squat', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Squat' },
      { id: 'lunge', name: 'Lunge', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Lunge' },
      { id: 'lunges', name: 'Lunges', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Lunge' },
      { id: 'dumbbell-lunge', name: 'Dumbbell Lunge', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Lunge' },
      { id: 'leg-press', name: 'Leg Press', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Leg Press' },
      { id: 'leg-curl', name: 'Leg Curl', isCustom: false, muscleGroup: 'Hamstrings', category: 'Legs', side: 'Back', baseExercise: 'Leg Curl' },
      { id: 'leg-extension', name: 'Leg Extension', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Leg Extension' },
      { id: 'calf-raise', name: 'Calf Raise', isCustom: false, muscleGroup: 'Calves', category: 'Legs', side: 'Back', baseExercise: 'Calf Raise' },
      { id: 'smith-squat', name: 'Smith Squat', isCustom: false, muscleGroup: 'Quads', category: 'Legs', side: 'Front', baseExercise: 'Squat' },
      { id: 'dumbbell-romanian-deadlift', name: 'Dumbbell Romanian Deadlift', isCustom: false, muscleGroup: 'Hamstrings', category: 'Pull', side: 'Back', baseExercise: 'Deadlift' },

      // Core / Conditioning
      { id: 'plank', name: 'Plank', isCustom: false, muscleGroup: 'Abs', category: 'Core', side: 'Front', baseExercise: 'Plank' },
      { id: 'crunches', name: 'Crunches', isCustom: false, muscleGroup: 'Abs', category: 'Core', side: 'Front', baseExercise: 'Crunch' },
      { id: 'bicycle-crunches', name: 'Bicycle Crunches', isCustom: false, muscleGroup: 'Abs', category: 'Core', side: 'Front', baseExercise: 'Crunch' },
      { id: 'mountain-climbers', name: 'Mountain Climbers', isCustom: false, muscleGroup: 'Abs', category: 'Core', side: 'Front', baseExercise: 'Mountain Climbers' },
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
