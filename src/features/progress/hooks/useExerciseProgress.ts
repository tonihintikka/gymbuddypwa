
import { useState, useEffect, useCallback } from 'react';
import { getAllItems } from '../../../services/db';
import { WorkoutLog, SetLog } from '../../types/models';

// Function to calculate estimated 1-Rep Max using the Epley formula
const calculate1RM = (weight: number, reps: number) => {
  if (reps === 0) return 0;
  return weight * (1 + reps / 30);
};

export const useExerciseProgress = (exerciseId: string) => {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processData = useCallback((logs: WorkoutLog[]) => {
    const exerciseProgress: any[] = [];

    logs.forEach(log => {
      const exerciseData = log.loggedExercises.find(ex => ex.exerciseId === exerciseId);
      if (exerciseData) {
        let dailyMax1RM = 0;
        let dailyMaxWeight = 0;
        let dailyTotalVolume = 0;
        let dailyTotalReps = 0;

        exerciseData.sets.forEach(set => {
          const set1RM = calculate1RM(set.weight, set.reps);
          if (set1RM > dailyMax1RM) {
            dailyMax1RM = set1RM;
          }
          if (set.weight > dailyMaxWeight) {
            dailyMaxWeight = set.weight;
          }
          dailyTotalVolume += set.weight * set.reps;
          dailyTotalReps += set.reps;
        });

        exerciseProgress.push({
          date: log.date,
          estimated1RM: dailyMax1RM,
          maxWeight: dailyMaxWeight,
          totalVolume: dailyTotalVolume,
          totalReps: dailyTotalReps,
        });
      }
    });

    // Sort by date
    exerciseProgress.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setProgressData(exerciseProgress);
  }, [exerciseId]);

  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const logs = await getAllItems<WorkoutLog>('workoutLogs');
      processData(logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [processData]);

  useEffect(() => {
    if (exerciseId) {
      loadProgress();
    } else {
      setProgressData([]);
    }
  }, [exerciseId, loadProgress]);

  return { progressData, loading, error, refresh: loadProgress };
};
