import { ProgramExercise, Exercise } from '../../../types/models';

interface ProgramExerciseItemProps {
  programExercise: ProgramExercise;
  exercise: Exercise;
  onRemove?: () => void;
  onEdit?: () => void;
}

export const ProgramExerciseItem = ({
  programExercise,
  exercise,
  onRemove,
  onEdit
}: ProgramExerciseItemProps) => {
  return (
    <div className="program-exercise-item">
      <div className="program-exercise-info">
        <h4 className="program-exercise-name">{exercise.name}</h4>
        <div className="program-exercise-targets">
          {programExercise.targetSets && (
            <span className="program-exercise-sets">
              {programExercise.targetSets} {programExercise.targetSets === 1 ? 'set' : 'sets'}
            </span>
          )}
          {programExercise.targetReps && (
            <span className="program-exercise-reps">
              {programExercise.targetReps} reps
            </span>
          )}
        </div>
        {programExercise.notes && (
          <p className="program-exercise-notes">{programExercise.notes}</p>
        )}
      </div>
      
      <div className="program-exercise-actions">
        {onEdit && (
          <button 
            className="edit-program-exercise-btn"
            onClick={onEdit}
          >
            Edit
          </button>
        )}
        {onRemove && (
          <button 
            className="remove-program-exercise-btn"
            onClick={onRemove}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};
