import { WorkoutLog, Exercise } from '../../../types/models';
import { formatDate, formatTime } from '../../../utils/dateFormatters';

interface WorkoutSummaryProps {
  workout: WorkoutLog;
  exercises: Exercise[];
  programName?: string;
  duration: string;
  onClose: () => void;
}

export const WorkoutSummary = ({
  workout,
  exercises,
  programName,
  duration,
  onClose
}: WorkoutSummaryProps) => {
  // Calculate total volume (weight * reps)
  const totalVolume = workout.loggedExercises.reduce((total, loggedExercise) => {
    return total + loggedExercise.sets.reduce((exerciseTotal, set) => {
      return exerciseTotal + (set.weight * set.reps);
    }, 0);
  }, 0);

  // Calculate total sets
  const totalSets = workout.loggedExercises.reduce((total, loggedExercise) => {
    return total + loggedExercise.sets.length;
  }, 0);

  // Calculate total reps
  const totalReps = workout.loggedExercises.reduce((total, loggedExercise) => {
    return total + loggedExercise.sets.reduce((exerciseTotal, set) => {
      return exerciseTotal + set.reps;
    }, 0);
  }, 0);

  return (
    <div className="workout-summary feature-container">
      <h2>Workout Complete!</h2>

      <div className="summary-info">
        <div className="summary-row">
          <span className="summary-label">Date:</span>
          <span className="summary-value">{formatDate(workout.date)}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Time:</span>
          <span className="summary-value">{formatTime(workout.date)}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Duration:</span>
          <span className="summary-value">{duration}</span>
        </div>

        {programName && (
          <div className="summary-row">
            <span className="summary-label">Program:</span>
            <span className="summary-value">{programName}</span>
          </div>
        )}

        <div className="summary-row">
          <span className="summary-label">Exercises:</span>
          <span className="summary-value">{workout.loggedExercises.length}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Total Sets:</span>
          <span className="summary-value">{totalSets}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Total Reps:</span>
          <span className="summary-value">{totalReps}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Total Volume:</span>
          <span className="summary-value">{totalVolume.toLocaleString()} kg</span>
        </div>
      </div>

      <div className="exercise-summary">
        <h3>Exercises</h3>

        {workout.loggedExercises.map((loggedExercise, index) => {
          const exercise = exercises.find(e => e.id === loggedExercise.exerciseId);

          if (!exercise) return null;

          return (
            <div key={index} className="exercise-summary-item">
              <h4>{exercise.name}</h4>
              <div className="sets-summary">
                {loggedExercise.sets.length > 0 ? (
                  loggedExercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="set-summary">
                      <span className="set-number">Set {setIndex + 1}:</span>
                      <span className="set-details">
                        {set.weight} kg × {set.reps} reps
                        {(set.isFailure || set.isPaused || set.isSlowEccentric) && (
                          <span className="set-modifiers">
                            {set.isFailure && ' (Failure)'}
                            {set.isPaused && ' (Paused)'}
                            {set.isSlowEccentric && ' (Slow Eccentric)'}
                          </span>
                        )}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="no-sets-message">No sets logged</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="close-summary-btn"
        onClick={onClose}
      >
        Done
      </button>
    </div>
  );
};
