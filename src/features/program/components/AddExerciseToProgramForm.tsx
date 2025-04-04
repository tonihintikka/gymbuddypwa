import { useState } from 'react';
import { Exercise } from '../../../types/models';

interface AddExerciseToProgramFormProps {
  exercises: Exercise[];
  onAdd: (exerciseId: string, targetSets?: number, targetReps?: string, notes?: string) => Promise<boolean>;
  onCancel?: () => void;
}

export const AddExerciseToProgramForm = ({ 
  exercises, 
  onAdd, 
  onCancel 
}: AddExerciseToProgramFormProps) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [targetSets, setTargetSets] = useState('');
  const [targetReps, setTargetReps] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  // Filter exercises based on search input
  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedExerciseId) {
      setError('Please select an exercise');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await onAdd(
        selectedExerciseId,
        targetSets ? parseInt(targetSets, 10) : undefined,
        targetReps || undefined,
        notes || undefined
      );
      
      if (success) {
        setSelectedExerciseId('');
        setTargetSets('');
        setTargetReps('');
        setNotes('');
        if (onCancel) {
          onCancel();
        }
      } else {
        setError('Failed to add exercise to program');
      }
    } catch (err) {
      setError('An error occurred while adding the exercise');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-exercise-to-program-form">
      <h2>Add Exercise to Program</h2>
      
      <div className="exercise-search">
        <input
          type="text"
          placeholder="Search exercises..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="exercise-select">Select Exercise</label>
          <select
            id="exercise-select"
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">-- Select an exercise --</option>
            {filteredExercises.map(exercise => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name} {exercise.isCustom ? '(Custom)' : ''}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="target-sets">Target Sets (Optional)</label>
          <input
            id="target-sets"
            type="number"
            min="1"
            value={targetSets}
            onChange={(e) => setTargetSets(e.target.value)}
            placeholder="e.g., 3"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="target-reps">Target Reps (Optional)</label>
          <input
            id="target-reps"
            type="text"
            value={targetReps}
            onChange={(e) => setTargetReps(e.target.value)}
            placeholder="e.g., 8-12 or 5"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="exercise-notes">Notes (Optional)</label>
          <textarea
            id="exercise-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes for this exercise"
            disabled={isSubmitting}
            rows={2}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
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
            disabled={isSubmitting || !selectedExerciseId}
          >
            {isSubmitting ? 'Adding...' : 'Add to Program'}
          </button>
        </div>
      </form>
    </div>
  );
};
