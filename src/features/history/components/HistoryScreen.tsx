import { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useExercises } from '../../exercise/hooks/useExercises';
import { usePrograms } from '../../program/hooks/usePrograms';
import { HistoryList } from './HistoryList';
import { WorkoutDetailView } from './WorkoutDetailView';
import { DataSection } from '../../backup/components/DataSection';

export const HistoryScreen = () => {
  const {
    workoutLogs,
    loading,
    error,
    refreshHistory,
    deleteWorkoutLog,
    updateWorkoutLog
  } = useHistory();

  const { exercises } = useExercises();
  const { programs } = usePrograms();

  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [showData, setShowData] = useState(false);

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

      {showData ? (
        <DataSection onBack={() => setShowData(false)} />
      ) : selectedWorkout ? (
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

          <div className="history-actions">
            <button
              type="button"
              className="data-action-btn"
              onClick={() => setShowData(true)}
            >
              Backup & data
            </button>
          </div>
        </>
      )}
    </div>
  );
};
