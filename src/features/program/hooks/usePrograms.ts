/**
 * Custom hook for managing workout programs
 */
import { useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { Program, ProgramExercise } from '../../../types/models';
import { STORES } from '../../../services/db';

// Built-in workout programs
const builtInPrograms: Program[] = [
  {
    id: 'three-day-split',
    name: '3-Day Training Split',
    description: 'A balanced 3-day workout split targeting all major muscle groups with compound and isolation exercises.',
    exercises: [
      // Workout 1
      { exerciseId: 'squat', targetSets: 4, targetReps: '8-10', notes: 'Workout 1' },
      { exerciseId: 'bench-press', targetSets: 4, targetReps: '5-8', notes: 'Workout 1' },
      { exerciseId: 'pull-ups', targetSets: 4, targetReps: 'max', notes: 'Workout 1' },
      { exerciseId: 'tricep-pushdown', targetSets: 3, targetReps: '10-12', notes: 'Workout 1' },
      { exerciseId: 'crunches', targetSets: 3, targetReps: '10-15', notes: 'Workout 1' },
      
      // Workout 2
      { exerciseId: 'deadlift', targetSets: 4, targetReps: '5-8', notes: 'Workout 2' },
      { exerciseId: 'overhead-press', targetSets: 4, targetReps: '8-10', notes: 'Workout 2' },
      { exerciseId: 'barbell-row', targetSets: 4, targetReps: '8-10', notes: 'Workout 2' },
      { exerciseId: 'dumbbell-curl', targetSets: 3, targetReps: '10-12', notes: 'Workout 2' },
      { exerciseId: 'plank', targetSets: 3, targetReps: '30-60s', notes: 'Workout 2' },
      
      // Workout 3
      { exerciseId: 'front-squat', targetSets: 4, targetReps: '8-10', notes: 'Workout 3' },
      { exerciseId: 'incline-bench-press', targetSets: 4, targetReps: '5-8', notes: 'Workout 3' },
      { exerciseId: 'pull-ups', targetSets: 4, targetReps: 'max', notes: 'Workout 3' },
      { exerciseId: 'tricep-dips', targetSets: 3, targetReps: '8-12', notes: 'Workout 3' },
      { exerciseId: 'bicycle-crunches', targetSets: 3, targetReps: '10-15', notes: 'Workout 3' },
    ]
  },
  {
    id: 'beginner-full-body',
    name: 'Beginner Full Body Workout',
    description: 'A comprehensive full-body workout for beginners targeting all major muscle groups.',
    exercises: [
      { exerciseId: 'squat', targetSets: 3, targetReps: '8-12' },
      { exerciseId: 'bench-press', targetSets: 3, targetReps: '8-12' },
      { exerciseId: 'lat-pulldown', targetSets: 3, targetReps: '8-12' },
      { exerciseId: 'overhead-press', targetSets: 3, targetReps: '8-12' },
      { exerciseId: 'dumbbell-curl', targetSets: 3, targetReps: '10-15' },
      { exerciseId: 'tricep-pushdown', targetSets: 3, targetReps: '10-15' },
      { exerciseId: 'plank', targetSets: 3, targetReps: '30-60s' },
    ]
  },
  {
    id: 'upper-lower-split',
    name: 'Upper/Lower Split',
    description: 'A balanced program alternating between upper and lower body training days.',
    exercises: [
      // Upper Body Day
      { exerciseId: 'bench-press', targetSets: 4, targetReps: '8-10', notes: 'Upper Body Day' },
      { exerciseId: 'barbell-row', targetSets: 4, targetReps: '8-10', notes: 'Upper Body Day' },
      { exerciseId: 'overhead-press', targetSets: 3, targetReps: '8-10', notes: 'Upper Body Day' },
      { exerciseId: 'pull-ups', targetSets: 3, targetReps: '8-10', notes: 'Upper Body Day' },
      { exerciseId: 'dumbbell-curl', targetSets: 3, targetReps: '10-12', notes: 'Upper Body Day' },
      { exerciseId: 'skull-crusher', targetSets: 3, targetReps: '10-12', notes: 'Upper Body Day' },
      // Lower Body Day
      { exerciseId: 'squat', targetSets: 4, targetReps: '8-10', notes: 'Lower Body Day' },
      { exerciseId: 'romanian-deadlift', targetSets: 4, targetReps: '8-10', notes: 'Lower Body Day' },
      { exerciseId: 'leg-press', targetSets: 3, targetReps: '10-12', notes: 'Lower Body Day' },
      { exerciseId: 'leg-curl', targetSets: 3, targetReps: '10-12', notes: 'Lower Body Day' },
      { exerciseId: 'calf-raise', targetSets: 4, targetReps: '15-20', notes: 'Lower Body Day' },
      { exerciseId: 'plank', targetSets: 3, targetReps: '30-60s', notes: 'Lower Body Day' },
    ]
  },
  {
    id: 'push-pull-legs',
    name: 'Push/Pull/Legs Split',
    description: 'A classic bodybuilding split focusing on push, pull, and leg movements over 3 days.',
    exercises: [
      // Push Day
      { exerciseId: 'bench-press', targetSets: 4, targetReps: '8-10', notes: 'Push Day' },
      { exerciseId: 'incline-dumbbell-press', targetSets: 3, targetReps: '8-12', notes: 'Push Day' },
      { exerciseId: 'overhead-press', targetSets: 3, targetReps: '8-10', notes: 'Push Day' },
      { exerciseId: 'lateral-raise', targetSets: 3, targetReps: '10-15', notes: 'Push Day' },
      { exerciseId: 'tricep-pushdown', targetSets: 3, targetReps: '10-15', notes: 'Push Day' },
      { exerciseId: 'overhead-tricep-extension', targetSets: 3, targetReps: '10-15', notes: 'Push Day' },
      // Pull Day
      { exerciseId: 'deadlift', targetSets: 3, targetReps: '6-8', notes: 'Pull Day' },
      { exerciseId: 'barbell-row', targetSets: 4, targetReps: '8-10', notes: 'Pull Day' },
      { exerciseId: 'lat-pulldown', targetSets: 3, targetReps: '10-12', notes: 'Pull Day' },
      { exerciseId: 'face-pull', targetSets: 3, targetReps: '12-15', notes: 'Pull Day' },
      { exerciseId: 'barbell-curl', targetSets: 3, targetReps: '10-12', notes: 'Pull Day' },
      { exerciseId: 'hammer-curl', targetSets: 3, targetReps: '10-12', notes: 'Pull Day' },
      // Legs Day
      { exerciseId: 'squat', targetSets: 4, targetReps: '8-10', notes: 'Legs Day' },
      { exerciseId: 'leg-press', targetSets: 3, targetReps: '10-12', notes: 'Legs Day' },
      { exerciseId: 'romanian-deadlift', targetSets: 3, targetReps: '8-10', notes: 'Legs Day' },
      { exerciseId: 'leg-curl', targetSets: 3, targetReps: '10-12', notes: 'Legs Day' },
      { exerciseId: 'calf-raise', targetSets: 4, targetReps: '15-20', notes: 'Legs Day' },
      { exerciseId: 'plank', targetSets: 2, targetReps: '30-60s', notes: 'Legs Day' },
    ]
  },
  {
    id: 'strength-training',
    name: 'Strength Training Program',
    description: 'A powerlifting-focused program to build strength in the main compound lifts.',
    exercises: [
      { exerciseId: 'squat', targetSets: 5, targetReps: '5' },
      { exerciseId: 'bench-press', targetSets: 5, targetReps: '5' },
      { exerciseId: 'deadlift', targetSets: 5, targetReps: '5' },
      { exerciseId: 'overhead-press', targetSets: 5, targetReps: '5' },
      { exerciseId: 'barbell-row', targetSets: 5, targetReps: '5' },
      { exerciseId: 'pull-ups', targetSets: 3, targetReps: '5-8' },
      { exerciseId: 'dips', targetSets: 3, targetReps: '5-8' },
    ]
  },
  {
    id: 'bodyweight-training',
    name: 'Bodyweight Workout',
    description: 'A full-body workout using only bodyweight exercises, perfect for home workouts.',
    exercises: [
      { exerciseId: 'push-ups', targetSets: 3, targetReps: '10-15' },
      { exerciseId: 'pull-ups', targetSets: 3, targetReps: '8-12' },
      { exerciseId: 'lunges', targetSets: 3, targetReps: '10-12 each leg' },
      { exerciseId: 'plank', targetSets: 3, targetReps: '30-60s' },
      { exerciseId: 'bicycle-crunches', targetSets: 3, targetReps: '15-20' },
      { exerciseId: 'mountain-climbers', targetSets: 3, targetReps: '20-30' },
      { exerciseId: 'tricep-dips', targetSets: 3, targetReps: '10-15' },
    ]
  }
];

export function usePrograms() {
  const { 
    items: customPrograms, 
    loading, 
    error, 
    saveItem, 
    getItem,
    deleteItem,
    loadItems 
  } = useIndexedDB<Program>(STORES.PROGRAMS);

  // Combine built-in and custom programs
  const allPrograms = [...builtInPrograms, ...customPrograms];

  // Initialize built-in programs in the database
  useEffect(() => {
    const initializeBuiltInPrograms = async () => {
      // Only run if we have custom programs loaded (after initial load) and no built-in programs saved
      if (!loading && customPrograms.length >= 0) {
        const savedBuiltInPrograms = customPrograms.filter(p => 
          builtInPrograms.some(bp => bp.id === p.id)
        );
        
        // Check which built-in programs need to be saved
        const programsToSave = builtInPrograms.filter(p => 
          !savedBuiltInPrograms.some(sp => sp.id === p.id)
        );
        
        console.log(`Saving ${programsToSave.length} built-in programs to database`);
        
        // Save each missing built-in program
        for (const program of programsToSave) {
          await saveItem(program);
        }
        
        // Reload programs to update the list
        if (programsToSave.length > 0) {
          await loadItems();
        }
      }
    };
    
    initializeBuiltInPrograms();
  }, [loading, customPrograms, saveItem, loadItems]);

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
    const program = allPrograms.find(p => p.id === id);
    
    if (!program || builtInPrograms.some(p => p.id === id)) {
      return false;
    }
    
    return await deleteItem(id);
  }, [allPrograms, deleteItem]);

  return {
    programs: allPrograms,
    customPrograms,
    builtInPrograms,
    loading,
    error,
    createProgram,
    addExerciseToProgram,
    removeExerciseFromProgram,
    deleteProgram,
  };
}
