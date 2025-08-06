/**
 * Custom hook for accessing workout history
 */
import { useCallback, useState } from 'react';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { WorkoutLog } from '../../../types/models';
import { STORES } from '../../../services/db';

export function useHistory() {
  const { 
    items: workoutLogs, 
    loading, 
    error, 
    loadItems,
    getItem,
    deleteItem 
  } = useIndexedDB<WorkoutLog>(STORES.WORKOUT_LOGS);
  const { saveItem: updateWorkout } = useIndexedDB<WorkoutLog>(STORES.WORKOUT_LOGS);
  
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutLog | null>(null);

  // Sort workout logs by date (newest first)
  const sortedWorkoutLogs = [...workoutLogs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Select a workout to view details
  const selectWorkout = useCallback(async (id: string) => {
    const workout = await getItem(id);
    setSelectedWorkout(workout);
    return workout;
  }, [getItem]);

  // Clear the selected workout
  const clearSelectedWorkout = useCallback(() => {
    setSelectedWorkout(null);
  }, []);

  // Delete a workout log
  const deleteWorkoutLog = useCallback(async (id: string) => {
    const success = await deleteItem(id);
    
    if (success && selectedWorkout?.id === id) {
      clearSelectedWorkout();
    }
    
    return success;
  }, [deleteItem, selectedWorkout, clearSelectedWorkout]);

  // Update a workout log
  const updateWorkoutLog = useCallback(async (workout: WorkoutLog) => {
    const success = await updateWorkout(workout);
    if (success) {
      await loadItems();
      setSelectedWorkout(workout);
    }
    return success;
  }, [updateWorkout, loadItems]);

  // Export workout logs as JSON
  const exportWorkoutLogs = useCallback(() => {
    const dataStr = JSON.stringify(workoutLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `gymtrack-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [workoutLogs]);

  return {
    workoutLogs: sortedWorkoutLogs,
    selectedWorkout,
    loading,
    error,
    refreshHistory: loadItems,
    selectWorkout,
    clearSelectedWorkout,
    deleteWorkoutLog,
    exportWorkoutLogs,
    updateWorkoutLog,
  };
}
