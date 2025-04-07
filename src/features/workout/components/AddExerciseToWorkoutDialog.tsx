import { useState } from 'react';
import { Exercise } from '../../../types/models';

interface AddExerciseToWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  onAddExercise: (exerciseId: string) => void;
}

export const AddExerciseToWorkoutDialog = ({
  isOpen,
  onClose,
  exercises,
  onAddExercise
}: AddExerciseToWorkoutDialogProps) => {
  const [filter, setFilter] = useState('');
  
  if (!isOpen) return null;
  
  // Filter exercises based on search input
  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="add-exercise-to-workout">
          <h2>Add Exercise to Workout</h2>
          
          <div className="exercise-search">
            <input
              type="text"
              placeholder="Search exercises..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              autoFocus
            />
          </div>
          
          {filteredExercises.length === 0 ? (
            <div className="no-exercises">
              {filter ? 
                `No exercises found matching "${filter}"` : 
                'No exercises available.'}
            </div>
          ) : (
            <ul className="exercise-list">
              {filteredExercises.map(exercise => (
                <li 
                  key={exercise.id} 
                  className={`exercise-item ${exercise.isCustom ? 'custom' : ''}`}
                  onClick={() => {
                    onAddExercise(exercise.id);
                    onClose();
                  }}
                >
                  <span className="exercise-name">{exercise.name}</span>
                  {exercise.isCustom && (
                    <span className="custom-badge">Custom</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
