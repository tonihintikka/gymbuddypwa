
import React from 'react';
import { GroupedExercises } from '../hooks/useExercisesWithHistory';

interface ExerciseSelectorProps {
  groupedExercises: GroupedExercises;
  selectedExercise: string;
  onSelectExercise: (exerciseId: string) => void;
  loading: boolean;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ 
  groupedExercises, 
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
        style={{ minWidth: '300px' }}
      >
        <option value="">-- Select an exercise --</option>
        
        {/* Exercises with workout data */}
        {groupedExercises.withData.length > 0 && (
          <>
            <option disabled value="" style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
              — Exercises with Data —
            </option>
            {groupedExercises.withData.map(item => (
              <option key={item.exercise.id} value={item.exercise.id}>
                {item.exercise.name} ({item.workoutCount} workout{item.workoutCount !== 1 ? 's' : ''})
              </option>
            ))}
          </>
        )}
        
        {/* Separator */}
        {groupedExercises.withData.length > 0 && groupedExercises.withoutData.length > 0 && (
          <option disabled value="" style={{ backgroundColor: '#e0e0e0' }}>
            ────────────────────────
          </option>
        )}
        
        {/* Exercises without workout data */}
        {groupedExercises.withoutData.length > 0 && (
          <>
            <option disabled value="" style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
              — All Exercises —
            </option>
            {groupedExercises.withoutData.map(item => (
              <option key={item.exercise.id} value={item.exercise.id}>
                {item.exercise.name}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
};

export default ExerciseSelector;
