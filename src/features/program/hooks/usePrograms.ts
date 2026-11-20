/**
 * Custom hook for managing workout programs
 */
import { useCallback, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { Program, ProgramExercise, ProgramDay } from '../../../types/models';
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
  },
  {
    id: 'five-day-40plus',
    name: '5-Day Recovery-Friendly (40+)',
    description: 'A 5-day program designed for beginners over 40 with limited time. Focus on compounds, recovery, and leaving 1-2 reps in the tank. Upper/Lower style with lighter fifth day.',
    exercises: [], // Flat list empty when using days
    days: [
      {
        id: 'day1',
        name: 'Day 1 - Upper A',
        exercises: [
          { exerciseId: 'bench-press', targetSets: 3, targetReps: '8-10' },
          { exerciseId: 'angled-t-bar-row', targetSets: 3, targetReps: '8-10' },
          { exerciseId: 'overhead-press', targetSets: 3, targetReps: '8-10' },
          { exerciseId: 'lat-pulldown', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 'dumbbell-curl', targetSets: 2, targetReps: '10-12' },
          { exerciseId: 'tricep-pushdown', targetSets: 2, targetReps: '10-12' },
        ]
      },
      {
        id: 'day2',
        name: 'Day 2 - Lower A',
        exercises: [
          { exerciseId: 'squat', targetSets: 3, targetReps: '8-10' },
          { exerciseId: 'hack-squat', targetSets: 3, targetReps: '8-10' },
          { exerciseId: 'romanian-deadlift', targetSets: 3, targetReps: '8-10' },
          { exerciseId: 'calf-raise', targetSets: 3, targetReps: '12-15' },
          { exerciseId: 'plank', targetSets: 2, targetReps: '20-40s' },
        ]
      },
      {
        id: 'day3',
        name: 'Day 3 - Upper B',
        exercises: [
          { exerciseId: 'incline-bench-press', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 'lat-pulldown', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 't-bar-row', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 'lateral-raise', targetSets: 3, targetReps: '12-15' },
          { exerciseId: 'face-pull', targetSets: 2, targetReps: '12-15' },
        ]
      },
      {
        id: 'day4',
        name: 'Day 4 - Lower B',
        exercises: [
          { exerciseId: 'hack-squat', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 'leg-curl', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 'leg-extension', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 'romanian-deadlift', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 'plank', targetSets: 2, targetReps: '20-40s' },
        ]
      },
      {
        id: 'day5',
        name: 'Day 5 - Upper C',
        exercises: [
          { exerciseId: 'dumbbell-bench-press', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 't-bar-row-close-grip', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 'dumbbell-shoulder-press', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 'dumbbell-curl', targetSets: 2, targetReps: '10-12' },
          { exerciseId: 'tricep-pushdown', targetSets: 2, targetReps: '10-12' },
          { exerciseId: 'face-pull', targetSets: 2, targetReps: '15' },
        ]
      },
    ] as ProgramDay[]
  }
];

export function usePrograms() {
  const { 
    items: programsFromDB, 
    loading, 
    error, 
    saveItem, 
    getItem,
    deleteItem,
    loadItems 
  } = useIndexedDB<Program>(STORES.PROGRAMS);

  // Get custom programs (exclude any built-in ones by ID)
  const customPrograms = useMemo(() => {
    const builtInProgramIds = builtInPrograms.map(p => p.id);
    return programsFromDB.filter(p => !builtInProgramIds.includes(p.id));
  }, [programsFromDB]);

  // Get database-saved versions of built-in programs
  const savedBuiltInPrograms = useMemo(() => {
    const builtInProgramIds = builtInPrograms.map(p => p.id);
    return programsFromDB.filter(p => builtInProgramIds.includes(p.id));
  }, [programsFromDB]);

  // Combine programs, prioritizing saved built-in programs over the default ones
  // This ensures we don't duplicate IDs in the list
  const allPrograms = useMemo(() => {
    // Get built-in programs that aren't already in DB
    const unsavedBuiltInPrograms = builtInPrograms.filter(
      p => !savedBuiltInPrograms.some(sp => sp.id === p.id)
    );
    
    // Combine: saved built-ins + unsaved built-ins + custom programs
    return [...savedBuiltInPrograms, ...unsavedBuiltInPrograms, ...customPrograms];
  }, [savedBuiltInPrograms, customPrograms]);

  // Initialize / migrate built-in programs in the database
  useEffect(() => {
    const initializeBuiltInPrograms = async () => {
      if (loading) return;

      let needsReload = false;

      for (const builtIn of builtInPrograms) {
        const saved = savedBuiltInPrograms.find(sp => sp.id === builtIn.id);

        // Missing entirely → save it
        if (!saved) {
          console.log(`Saving missing built-in program: ${builtIn.id}`);
          await saveItem(builtIn);
          needsReload = true;
          continue;
        }

        // Exists but is outdated (has days in code but not in DB, or vice versa)
        const codeHasDays = !!builtIn.days && builtIn.days.length > 0;
        const savedHasDays = !!saved.days && saved.days.length > 0;

        if (codeHasDays && !savedHasDays) {
          console.log(`Migrating built-in program to days structure: ${builtIn.id}`);
          await saveItem(builtIn);
          needsReload = true;
        }
      }

      if (needsReload) {
        await loadItems();
      }
    };
    
    initializeBuiltInPrograms();
  }, [loading, savedBuiltInPrograms, saveItem, loadItems]);

  // Create a new program
  const createProgram = useCallback(async (name: string, description?: string) => {
    if (!name.trim()) {
      return null;
    }

    const newProgram: Program = {
      id: uuidv4(),
      name: name.trim(),
      description: description?.trim(),
      exercises: [],
    };

    const success = await saveItem(newProgram);
    if (success) {
      return newProgram;
    } else {
      return null;
    }
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
    // Check if it's a built-in program
    const isBuiltIn = builtInPrograms.some(p => p.id === id);
    
    if (isBuiltIn) {
      console.log(`Cannot delete built-in program: ${id}`);
      return false;
    }
    
    return await deleteItem(id);
  }, [deleteItem]);

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
