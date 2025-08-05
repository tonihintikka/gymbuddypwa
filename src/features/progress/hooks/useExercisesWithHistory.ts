import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllItems } from '../../../services/db';
import { STORES } from '../../../services/db';
import { WorkoutLog, Exercise } from '../../../types/models';

export interface ExerciseWithHistory {
  exercise: Exercise;
  workoutCount: number;
  hasData: boolean;
}

export interface GroupedExercises {
  withData: ExerciseWithHistory[];
  withoutData: ExerciseWithHistory[];
}

export const useExercisesWithHistory = (exercises: Exercise[]) => {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load workout logs
  const loadWorkoutLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const logs = await getAllItems<WorkoutLog>(STORES.WORKOUT_LOGS);
      setWorkoutLogs(logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workout logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkoutLogs();
  }, [loadWorkoutLogs]);

  // Calculate exercise workout counts
  const exerciseWorkoutCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    workoutLogs.forEach(log => {
      log.loggedExercises.forEach(loggedExercise => {
        if (loggedExercise.sets.length > 0) { // Only count if there are actual sets logged
          counts[loggedExercise.exerciseId] = (counts[loggedExercise.exerciseId] || 0) + 1;
        }
      });
    });
    
    return counts;
  }, [workoutLogs]);

  // Group exercises by whether they have workout data
  const groupedExercises: GroupedExercises = useMemo(() => {
    const exercisesWithHistory: ExerciseWithHistory[] = exercises.map(exercise => ({
      exercise,
      workoutCount: exerciseWorkoutCounts[exercise.id] || 0,
      hasData: (exerciseWorkoutCounts[exercise.id] || 0) > 0,
    }));

    const withData = exercisesWithHistory
      .filter(item => item.hasData)
      .sort((a, b) => b.workoutCount - a.workoutCount); // Sort by workout count descending

    const withoutData = exercisesWithHistory
      .filter(item => !item.hasData)
      .sort((a, b) => a.exercise.name.localeCompare(b.exercise.name)); // Sort alphabetically

    return {
      withData,
      withoutData,
    };
  }, [exercises, exerciseWorkoutCounts]);

  return {
    groupedExercises,
    loading,
    error,
    refresh: loadWorkoutLogs,
  };
};