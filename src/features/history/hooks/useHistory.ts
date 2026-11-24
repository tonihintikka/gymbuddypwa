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
  // Uses Web Share API on iOS (where <a download> is unreliable) and falls back to Blob download elsewhere.
  const exportWorkoutLogs = useCallback(async () => {
    const dataStr = JSON.stringify(sortedWorkoutLogs, null, 2);
    const fileName = `gymtrack-export-${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([dataStr], { type: 'application/json' });

    // Prefer Web Share API (works on iOS Safari / installed PWA)
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], fileName, { type: 'application/json' });
      const shareData = { files: [file], title: 'GymTrack Export', text: 'Workout history export' };

      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          // User cancelled or share failed — fall through to download
          console.warn('Share failed, falling back to download', err);
        }
      }
    }

    // Fallback: create object URL and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Revoke after a short delay so the download can start
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [sortedWorkoutLogs]);

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
