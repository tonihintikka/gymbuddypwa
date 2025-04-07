import { useState } from 'react';
import { Exercise } from '../../../types/models';

interface ExerciseListProps {
  exercises: Exercise[];
  onSelectExercise?: (exercise: Exercise) => void;
  onAddExercise?: () => void;
  onDeleteExercise?: (exerciseId: string) => void;
  loading?: boolean;
}

export const ExerciseList = ({
  exercises,
  onSelectExercise,
  onAddExercise,
  onDeleteExercise,
  loading = false,
}: ExerciseListProps) => {
  const [filter, setFilter] = useState('');

  // Filter exercises based on search input
  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading exercises...</div>;
  }

  return (
    <div className="exercise-list-container">
      <h2>Exercises</h2>
      <div className="exercise-search">
        <input
          type="text"
          placeholder="Search exercises..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <button
        className="add-exercise-btn"
        onClick={onAddExercise}
      >
        Add Exercise
      </button>

      {filteredExercises.length === 0 ? (
        <div className="no-exercises">
          {filter ?
            `No exercises found matching "${filter}"` :
            'No exercises available. Add your first exercise!'}
        </div>
      ) : (
        <ul className="exercise-list">
          {filteredExercises.map(exercise => (
            <li
              key={exercise.id}
              className={`exercise-item ${exercise.isCustom ? 'custom' : ''}`}
              onClick={() => onSelectExercise && onSelectExercise(exercise)}
            >
              <span className="exercise-name">{exercise.name}</span>
              {exercise.isCustom && onDeleteExercise && (
                <button
                  className="delete-exercise-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteExercise(exercise.id);
                  }}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
