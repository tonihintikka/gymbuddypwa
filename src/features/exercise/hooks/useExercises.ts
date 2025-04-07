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
  // Chest Exercises
  { id: 'bench-press', name: 'Bench Press', isCustom: false },
  { id: 'incline-bench-press', name: 'Incline Bench Press', isCustom: false },
  { id: 'decline-bench-press', name: 'Decline Bench Press', isCustom: false },
  { id: 'dumbbell-bench-press', name: 'Dumbbell Bench Press', isCustom: false },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', isCustom: false },
  { id: 'dumbbell-flyes', name: 'Dumbbell Flyes', isCustom: false },
  { id: 'cable-crossover', name: 'Cable Crossover', isCustom: false },
  { id: 'chest-dips', name: 'Chest Dips', isCustom: false },
  { id: 'push-ups', name: 'Push-ups', isCustom: false },
  { id: 'machine-chest-press', name: 'Machine Chest Press', isCustom: false },
  { id: 'pec-deck-machine', name: 'Pec Deck Machine', isCustom: false },
  
  // Back Exercises
  { id: 'deadlift', name: 'Deadlift', isCustom: false },
  { id: 'barbell-row', name: 'Barbell Row', isCustom: false },
  { id: 'seated-cable-row', name: 'Seated Cable Row', isCustom: false },
  { id: 'lat-pulldown', name: 'Lat Pulldown', isCustom: false },
  { id: 'pull-ups', name: 'Pull-ups', isCustom: false },
  { id: 'chin-ups', name: 'Chin-ups', isCustom: false },
  { id: 'dumbbell-row', name: 'Single-Arm Dumbbell Row', isCustom: false },
  { id: 't-bar-row', name: 'T-Bar Row', isCustom: false },
  { id: 'face-pull', name: 'Face Pull', isCustom: false },
  { id: 'good-morning', name: 'Good Morning', isCustom: false },
  { id: 'pullover', name: 'Dumbbell Pullover', isCustom: false },
  
  // Shoulder Exercises
  { id: 'overhead-press', name: 'Overhead Press', isCustom: false },
  { id: 'seated-dumbbell-press', name: 'Seated Dumbbell Press', isCustom: false },
  { id: 'lateral-raise', name: 'Lateral Raise', isCustom: false },
  { id: 'front-raise', name: 'Front Raise', isCustom: false },
  { id: 'reverse-flyes', name: 'Reverse Flyes', isCustom: false },
  { id: 'upright-row', name: 'Upright Row', isCustom: false },
  { id: 'shrugs', name: 'Shrugs', isCustom: false },
  { id: 'arnold-press', name: 'Arnold Press', isCustom: false },
  { id: 'push-press', name: 'Push Press', isCustom: false },
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', isCustom: false },
  
  // Leg Exercises
  { id: 'squat', name: 'Squat', isCustom: false },
  { id: 'leg-press', name: 'Leg Press', isCustom: false },
  { id: 'lunges', name: 'Lunges', isCustom: false },
  { id: 'leg-extension', name: 'Leg Extension', isCustom: false },
  { id: 'leg-curl', name: 'Leg Curl', isCustom: false },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', isCustom: false },
  { id: 'calf-raise', name: 'Calf Raise', isCustom: false },
  { id: 'hack-squat', name: 'Hack Squat', isCustom: false },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', isCustom: false },
  { id: 'goblet-squat', name: 'Goblet Squat', isCustom: false },
  { id: 'front-squat', name: 'Front Squat', isCustom: false },
  { id: 'glute-bridge', name: 'Glute Bridge', isCustom: false },
  { id: 'hip-thrust', name: 'Hip Thrust', isCustom: false },
  
  // Arm Exercises - Biceps
  { id: 'barbell-curl', name: 'Barbell Curl', isCustom: false },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', isCustom: false },
  { id: 'hammer-curl', name: 'Hammer Curl', isCustom: false },
  { id: 'incline-dumbbell-curl', name: 'Incline Dumbbell Curl', isCustom: false },
  { id: 'concentration-curl', name: 'Concentration Curl', isCustom: false },
  { id: 'preacher-curl', name: 'Preacher Curl', isCustom: false },
  { id: 'cable-curl', name: 'Cable Curl', isCustom: false },
  { id: 'ez-bar-curl', name: 'EZ Bar Curl', isCustom: false },
  
  // Arm Exercises - Triceps
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', isCustom: false },
  { id: 'skull-crusher', name: 'Skull Crusher', isCustom: false },
  { id: 'tricep-dips', name: 'Tricep Dips', isCustom: false },
  { id: 'close-grip-bench-press', name: 'Close-Grip Bench Press', isCustom: false },
  { id: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', isCustom: false },
  { id: 'diamond-push-ups', name: 'Diamond Push-ups', isCustom: false },
  { id: 'rope-pushdown', name: 'Rope Pushdown', isCustom: false },
  
  // Core/Abs Exercises
  { id: 'plank', name: 'Plank', isCustom: false },
  { id: 'crunches', name: 'Crunches', isCustom: false },
  { id: 'leg-raises', name: 'Leg Raises', isCustom: false },
  { id: 'russian-twist', name: 'Russian Twist', isCustom: false },
  { id: 'hanging-knee-raise', name: 'Hanging Knee Raise', isCustom: false },
  { id: 'ab-rollout', name: 'Ab Rollout', isCustom: false },
  { id: 'bicycle-crunches', name: 'Bicycle Crunches', isCustom: false },
  { id: 'mountain-climbers', name: 'Mountain Climbers', isCustom: false },
  { id: 'cable-woodchoppers', name: 'Cable Woodchoppers', isCustom: false },
  { id: 'deadbug', name: 'Dead Bug', isCustom: false },
  
  // Compound Full Body Exercises
  { id: 'clean-and-press', name: 'Clean and Press', isCustom: false },
  { id: 'clean-and-jerk', name: 'Clean and Jerk', isCustom: false },
  { id: 'snatch', name: 'Snatch', isCustom: false },
  { id: 'kettlebell-swing', name: 'Kettlebell Swing', isCustom: false },
  { id: 'thruster', name: 'Thruster', isCustom: false },
  { id: 'burpee', name: 'Burpee', isCustom: false },
  { id: 'man-maker', name: 'Man Maker', isCustom: false },
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
