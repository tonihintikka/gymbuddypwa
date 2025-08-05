
import React from 'react';
import { Exercise } from '../../types/models';

interface ExerciseSelectorProps {
  exercises: Exercise[];
  selectedExercise: string;
  onSelectExercise: (exerciseId: string) => void;
  loading: boolean;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ 
  exercises, 
  selectedExercise, 
  onSelectExercise, 
  loading 
}) => {
  if (loading) {
    return <p>Loading exercises...</p>;
  }

  return (
    <div>
      <label htmlFor="exercise-select">Select Exercise: </label>
      <select 
        id="exercise-select"
        value={selectedExercise}
        onChange={(e) => onSelectExercise(e.target.value)}
      >
        <option value="">-- Select an exercise --</option>
        {exercises.map(ex => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExerciseSelector;
