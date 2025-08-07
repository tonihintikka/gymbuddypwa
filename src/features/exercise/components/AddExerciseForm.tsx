import { useState } from 'react';
import { Exercise, MuscleGroup, ExerciseCategory } from '../../../types/models';

interface AddExerciseFormProps {
  onAdd: (exercise: Omit<Exercise, 'id' | 'isCustom'>) => Promise<boolean>;
  onCancel?: () => void;
}

export const AddExerciseForm = ({ onAdd, onCancel }: AddExerciseFormProps) => {
  const [exerciseName, setExerciseName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('Chest');
  const [category, setCategory] = useState<ExerciseCategory>('Push');
  const [side, setSide] = useState<'Front' | 'Back' | 'Other'>('Front');
  const [baseExercise, setBaseExercise] = useState('');
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
      const success = await onAdd({
        name: exerciseName,
        muscleGroup,
        category,
        side,
        baseExercise: baseExercise || exerciseName,
      });

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
        </div>

        <div className="form-group">
          <label htmlFor="muscle-group">Muscle Group</label>
          <select id="muscle-group" value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value as MuscleGroup)} disabled={isSubmitting}>
            <option value="Chest">Chest</option>
            <option value="Back">Back</option>
            <option value="Shoulders">Shoulders</option>
            <option value="Biceps">Biceps</option>
            <option value="Triceps">Triceps</option>
            <option value="Quads">Quads</option>
            <option value="Hamstrings">Hamstrings</option>
            <option value="Glutes">Glutes</option>
            <option value="Calves">Calves</option>
            <option value="Abs">Abs</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ExerciseCategory)} disabled={isSubmitting}>
            <option value="Push">Push</option>
            <option value="Pull">Pull</option>
            <option value="Legs">Legs</option>
            <option value="Core">Core</option>
            <option value="Full Body">Full Body</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="side">Side</label>
          <select id="side" value={side} onChange={(e) => setSide(e.target.value as 'Front' | 'Back' | 'Other')} disabled={isSubmitting}>
            <option value="Front">Front</option>
            <option value="Back">Back</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="base-exercise">Base Exercise (optional)</label>
          <input
            id="base-exercise"
            type="text"
            value={baseExercise}
            onChange={(e) => setBaseExercise(e.target.value)}
            placeholder="e.g., Bench Press"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Exercise'}
          </button>
        </div>
      </form>
    </div>
  );
};
