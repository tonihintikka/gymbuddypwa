
import React, { useState } from 'react';
import { useExercises } from '../../exercise/hooks/useExercises';
import { useExerciseProgress } from '../hooks/useExerciseProgress';
import { useExercisesWithHistory } from '../hooks/useExercisesWithHistory';
import ExerciseSelector from './ExerciseSelector';
import MetricToggle from './MetricToggle';
import ProgressChart from './ProgressChart';

const ProgressScreen: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('estimated1RM');
  
  const { exercises, loading: exercisesLoading } = useExercises();
  const { groupedExercises, loading: historyLoading } = useExercisesWithHistory(exercises);
  const { progressData, loading: progressLoading, error } = useExerciseProgress(selectedExercise);

  const isLoading = exercisesLoading || historyLoading;

  return (
    <div>
      <h2>Progress</h2>
      <ExerciseSelector 
        groupedExercises={groupedExercises}
        selectedExercise={selectedExercise}
        onSelectExercise={setSelectedExercise}
        loading={isLoading}
      />
      {selectedExercise && (
        <>
          <MetricToggle 
            selectedMetric={selectedMetric}
            onSelectMetric={setSelectedMetric}
          />
          {progressLoading ? (
            <p>Loading progress...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : progressData.length > 0 ? (
            <ProgressChart 
              progressData={progressData}
              selectedMetric={selectedMetric}
            />
          ) : (
            <p>No data available for this exercise.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ProgressScreen;
