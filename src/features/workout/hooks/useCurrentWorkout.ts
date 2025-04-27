import { useWorkoutContext } from '../context/WorkoutContext';
import { WorkoutLog } from '../../../types/models';

/**
 * Hook to access and manage the current workout state
 * This is a convenience wrapper around the WorkoutContext
 */
export const useCurrentWorkout = () => {
  const { workout, setWorkout, loading, error } = useWorkoutContext();

  /**
   * Sets the current workout
   * @param currentWorkout The workout to set as current
   */
  const setCurrentWorkout = (currentWorkout: WorkoutLog | null) => {
    setWorkout(currentWorkout);
  };

  return {
    currentWorkout: workout,
    setCurrentWorkout,
    loading,
    error
  };
}; 