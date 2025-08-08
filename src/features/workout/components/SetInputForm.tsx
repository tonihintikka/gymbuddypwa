import { useState } from 'react';
import { ProgramExercise } from '../../../types/models';

interface SetInputFormProps {
  onLogSet: (weight: number, reps: number, isFailure?: boolean, isPaused?: boolean, isSlowEccentric?: boolean) => void;
  programExercise?: ProgramExercise;
}

export const SetInputForm = ({ 
  onLogSet, 
  programExercise 
}: SetInputFormProps) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState(programExercise?.targetReps || '');
  const [isFailure, setIsFailure] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSlowEccentric, setIsSlowEccentric] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps.toString(), 10);
    
    if (isNaN(weightNum) || isNaN(repsNum) || weightNum < 0 || repsNum <= 0) {
      return;
    }
    
    onLogSet(weightNum, repsNum, isFailure, isPaused, isSlowEccentric);
    
    // Reset form
    setReps(programExercise?.targetReps || '');
    setIsFailure(false);
    setIsPaused(false);
    setIsSlowEccentric(false);
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
