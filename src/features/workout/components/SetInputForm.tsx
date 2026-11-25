import { useEffect, useState } from 'react';
import { ProgramExercise } from '../../../types/models';
import { formatKg } from '../rir';

const RIR_VALUES = [0, 1, 2, 3, 4, 5] as const;

interface SetInputFormProps {
  onLogSet: (
    weight: number,
    reps: number,
    isFailure?: boolean,
    isPaused?: boolean,
    isSlowEccentric?: boolean,
    rir?: number,
  ) => void;
  programExercise?: ProgramExercise;
  /** Filled into the weight field when weightPresetNonce changes. */
  weightPreset?: number;
  weightPresetNonce?: number;
}

export const SetInputForm = ({
  onLogSet,
  programExercise,
  weightPreset,
  weightPresetNonce = 0,
}: SetInputFormProps) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState(programExercise?.targetReps || '');
  const [isFailure, setIsFailure] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSlowEccentric, setIsSlowEccentric] = useState(false);
  const [rir, setRir] = useState<number | null>(null);

  useEffect(() => {
    if (!weightPresetNonce || weightPreset == null || Number.isNaN(weightPreset)) return;
    setWeight(formatKg(weightPreset));
  }, [weightPresetNonce, weightPreset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps.toString(), 10);

    if (isNaN(weightNum) || isNaN(repsNum) || weightNum < 0 || repsNum <= 0) {
      return;
    }

    onLogSet(weightNum, repsNum, isFailure, isPaused, isSlowEccentric, rir ?? undefined);

    setReps(programExercise?.targetReps || '');
    setIsFailure(false);
    setIsPaused(false);
    setIsSlowEccentric(false);
    setRir(null);
  };

  return (
    <form className="set-input-form" onSubmit={handleSubmit}>
      <div className="set-input-row">
        <div className="form-group">
          <label htmlFor="weight">Weight</label>
          <input
            id="weight"
            type="number"
            min="0"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="kg"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reps">Reps</label>
          <input
            id="reps"
            type="number"
            min="1"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder={programExercise?.targetReps || 'reps'}
            required
          />
        </div>
      </div>

      <div className="rir-picker">
        <span className="rir-picker-label" id="rir-picker-label">
          Reps in reserve (optional)
          {programExercise?.targetRir != null && (
            <span className="rir-picker-target"> · target {programExercise.targetRir}</span>
          )}
        </span>
        <div className="rir-buttons" role="group" aria-labelledby="rir-picker-label">
          {RIR_VALUES.map(value => (
            <button
              key={value}
              type="button"
              className="rir-btn"
              aria-pressed={rir === value}
              aria-label={`RIR ${value}`}
              onClick={() => setRir(current => (current === value ? null : value))}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="set-modifiers">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isFailure}
            onChange={(e) => setIsFailure(e.target.checked)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setIsFailure(!isFailure);
            }}
          />
          Failure
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isPaused}
            onChange={(e) => setIsPaused(e.target.checked)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setIsPaused(!isPaused);
            }}
          />
          Paused
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isSlowEccentric}
            onChange={(e) => setIsSlowEccentric(e.target.checked)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setIsSlowEccentric(!isSlowEccentric);
            }}
          />
          Slow Eccentric
        </label>
      </div>

      <button
        type="submit"
        className="log-set-btn"
        disabled={!weight || !reps}
      >
        Log Set
      </button>
    </form>
  );
};
