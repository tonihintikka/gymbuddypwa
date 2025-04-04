import { useState } from 'react';

interface AddExerciseFormProps {
  onAdd: (name: string) => Promise<boolean>;
  onCancel?: () => void;
}

export const AddExerciseForm = ({ onAdd, onCancel }: AddExerciseFormProps) => {
  const [exerciseName, setExerciseName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exerciseName.trim()) {
      setError('Exercise name cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await onAdd(exerciseName);
      
      if (success) {
        setExerciseName('');
        if (onCancel) {
          onCancel();
        }
      } else {
        setError('Failed to add exercise');
      }
    } catch (err) {
      setError('An error occurred while adding the exercise');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-exercise-form">
      <h2>Add New Exercise</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="exercise-name">Exercise Name</label>
          <input
            id="exercise-name"
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="Enter exercise name"
            disabled={isSubmitting}
            autoFocus
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        
        <div className="form-actions">
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              disabled={isSubmitting}
              className="secondary"
            >
              Cancel
            </button>
          )}
          
          <button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Exercise'}
          </button>
        </div>
      </form>
    </div>
  );
};
