import { useState } from 'react';
import { Exercise, LoggedExercise, ProgramExercise } from '../../../types/models';
import { SetInputForm } from './SetInputForm';
import { LoggedSetsList } from './LoggedSetsList';
import { useSetRecommendation } from '../hooks/useSetRecommendation';
import { formatKg } from '../rir';

interface ExerciseViewProps {
  exercise: Exercise;
  loggedExercise: LoggedExercise;
  programExercise?: ProgramExercise;
  onLogSet: (
    weight: number,
    reps: number,
    isFailure?: boolean,
    isPaused?: boolean,
    isSlowEccentric?: boolean,
    rir?: number,
  ) => void;
  onDeleteSet?: (index: number) => void;
}

export const ExerciseView = ({
  exercise,
  loggedExercise,
  programExercise,
  onLogSet,
  onDeleteSet
}: ExerciseViewProps) => {
  const recommendation = useSetRecommendation(exercise.id, programExercise?.targetRir);
  const [weightPresetNonce, setWeightPresetNonce] = useState(0);

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
            {programExercise.targetRir != null && (
              <span className="target-rir">
                RIR {programExercise.targetRir}
              </span>
            )}
          </div>
        )}
        {programExercise?.notes && (
          <p className="exercise-notes">{programExercise.notes}</p>
        )}
      </div>

      {recommendation && (
        <div className="set-recommendation" role="status">
          <p>{recommendation.message}</p>
          <button
            type="button"
            className="use-suggested-weight-btn secondary"
            onClick={() => setWeightPresetNonce(nonce => nonce + 1)}
          >
            Use {formatKg(recommendation.suggestedWeight)} kg
          </button>
        </div>
      )}

      <SetInputForm
        onLogSet={onLogSet}
        programExercise={programExercise}
        weightPreset={recommendation?.suggestedWeight}
        weightPresetNonce={weightPresetNonce}
      />

      <LoggedSetsList
        sets={loggedExercise.sets}
        onDeleteSet={onDeleteSet}
      />
    </div>
  );
};
