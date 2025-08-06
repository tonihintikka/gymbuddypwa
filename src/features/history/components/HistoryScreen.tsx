import { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useExercises } from '../../exercise/hooks/useExercises';
import { usePrograms } from '../../program/hooks/usePrograms';
import { HistoryList } from './HistoryList';
import { WorkoutDetailView } from './WorkoutDetailView';
import { WorkoutLog } from '../../../types/models';

export const HistoryScreen = () => {
  const {
    workoutLogs,
    loading,
    error,
    refreshHistory,
    deleteWorkoutLog,
    exportWorkoutLogs,
    updateWorkoutLog
  } = useHistory();

  const { exercises } = useExercises();
  const { programs } = usePrograms();

  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  // Find the selected workout
  const selectedWorkout = selectedWorkoutId
    ? workoutLogs.find(log => log.id === selectedWorkoutId)
    : null;

  // Find the program for the selected workout
  const workoutProgram = selectedWorkout?.programId
    ? programs.find(program => program.id === selectedWorkout.programId)
    : null;

  // Handle selecting a workout
  const handleSelectWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
  };

  // Handle deleting a workout
  const handleDeleteWorkout = async (workoutId: string) => {
    await deleteWorkoutLog(workoutId);

    if (selectedWorkoutId === workoutId) {
      setSelectedWorkoutId(null);
    }

    await refreshHistory();
  };

  // Handle going back to the list
  const handleBack = () => {
    setSelectedWorkoutId(null);
  };

  return (
    <div className="history-screen feature-container">
      {error && (
        <div className="error-banner">
          Error: {error}
        </div>
      )}

      {selectedWorkout ? (
        <WorkoutDetailView
          workout={selectedWorkout}
          exercises={exercises}
          program={workoutProgram}
          onBack={handleBack}
          onSave={updateWorkoutLog}
        />
      ) : (
        <>
          <HistoryList
            workoutLogs={workoutLogs}
            programs={programs}
            loading={loading}
            onSelectWorkout={handleSelectWorkout}
            onDeleteWorkout={handleDeleteWorkout}
          />

          {workoutLogs.length > 0 && (
            <div className="history-actions">
              <button
                className="export-btn"
                onClick={exportWorkoutLogs}
              >
                Export Workout History
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
