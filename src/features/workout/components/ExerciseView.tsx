import { Exercise, LoggedExercise, ProgramExercise } from '../../../types/models';
import { SetInputForm } from './SetInputForm';
import { LoggedSetsList } from './LoggedSetsList';

interface ExerciseViewProps {
  exercise: Exercise;
  loggedExercise: LoggedExercise;
  programExercise?: ProgramExercise;
  onLogSet: (weight: number, reps: number, isFailure?: boolean, isPaused?: boolean, isSlowEccentric?: boolean) => void;
  onDeleteSet?: (index: number) => void;
}

export const ExerciseView = ({
  exercise,
  loggedExercise,
  programExercise,
  onLogSet,
  onDeleteSet
}: ExerciseViewProps) => {
  return (
    <div className="exercise-view">
      <div className="exercise-header">
        <h3>{exercise.name}</h3>
        {programExercise && (
          <div className="exercise-targets">
            {programExercise.targetSets && (
              <span className="target-sets">
                Target: {programExercise.targetSets} {programExercise.targetSets === 1 ? 'set' : 'sets'}
              </span>
            )}
            {programExercise.targetReps && (
              <span className="target-reps">
                {programExercise.targetReps} reps
              </span>
            )}
          </div>
        )}
        {programExercise?.notes && (
          <p className="exercise-notes">{programExercise.notes}</p>
        )}
      </div>
      
      <SetInputForm 
        onLogSet={onLogSet}
        programExercise={programExercise}
      />
      
      <LoggedSetsList 
        sets={loggedExercise.sets}
        onDeleteSet={onDeleteSet}
      />
    </div>
  );
};
