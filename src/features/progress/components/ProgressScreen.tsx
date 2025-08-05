
import React, { useState } from 'react';
import { useExercises } from '../../exercise/hooks/useExercises';
import { useExerciseProgress } from '../hooks/useExerciseProgress';
import ExerciseSelector from './ExerciseSelector';
import MetricToggle from './MetricToggle';
import ProgressChart from './ProgressChart';

const ProgressScreen: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('estimated1RM');
  
  const { exercises, loading: exercisesLoading } = useExercises();
  const { progressData, loading: progressLoading, error } = useExerciseProgress(selectedExercise);

  return (
    <div>
      <h2>Progress</h2>
      <ExerciseSelector 
        exercises={exercises}
        selectedExercise={selectedExercise}
        onSelectExercise={setSelectedExercise}
        loading={exercisesLoading}
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
