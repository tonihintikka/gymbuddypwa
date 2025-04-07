import { WorkoutLog, Exercise, Program } from '../../../types/models';
import { formatDate, formatTime } from '../../../utils/dateFormatters';

interface WorkoutDetailViewProps {
  workout: WorkoutLog;
  exercises: Exercise[];
  program?: Program | null;
  onBack: () => void;
}

export const WorkoutDetailView = ({
  workout,
  exercises,
  program,
  onBack
}: WorkoutDetailViewProps) => {
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
    <div className="workout-detail-view">
      <div className="workout-detail-content">
      <div className="workout-detail-header">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to History
        </button>
        <h2>Workout Details</h2>
        <div className="workout-date-time">
          <div className="date">{formatDate(workout.date)}</div>
          <div className="time">{formatTime(workout.date)}</div>
        </div>
        {program && (
          <div className="workout-program-name">
            Program: {program.name}
          </div>
        )}
      </div>

      <div className="workout-summary-stats">
        <div className="stat-item">
          <div className="stat-value">{workout.loggedExercises.length}</div>
          <div className="stat-label">Exercises</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalSets}</div>
          <div className="stat-label">Sets</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalReps}</div>
          <div className="stat-label">Reps</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalVolume.toLocaleString()}</div>
          <div className="stat-label">Volume (kg)</div>
        </div>
      </div>

      <div className="workout-exercises">
        <h3>Exercises</h3>

        {workout.loggedExercises.map((loggedExercise, index) => {
          const exercise = exercises.find(e => e.id === loggedExercise.exerciseId);

          if (!exercise) return (
            <div key={index} className="missing-exercise">
              Exercise not found (ID: {loggedExercise.exerciseId})
            </div>
          );

          return (
            <div key={index} className="exercise-detail">
              <h4 className="exercise-name">{exercise.name}</h4>

              <table className="sets-table">
                <thead>
                  <tr>
                    <th>Set</th>
                    <th>Weight</th>
                    <th>Reps</th>
                    <th>Modifiers</th>
                  </tr>
                </thead>
                <tbody>
                  {loggedExercise.sets.map((set, setIndex) => (
                    <tr key={setIndex} className="set-row">
                      <td>{setIndex + 1}</td>
                      <td>{set.weight} kg</td>
                      <td>{set.reps}</td>
                      <td>
                        {(set.isFailure || set.isPaused || set.isSlowEccentric) ? (
                          <div className="set-modifiers-list">
                            {set.isFailure && <span className="modifier failure">F</span>}
                            {set.isPaused && <span className="modifier paused">P</span>}
                            {set.isSlowEccentric && <span className="modifier slow">S</span>}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="exercise-summary">
                <div className="exercise-volume">
                  Volume: {loggedExercise.sets.reduce((total, set) => total + (set.weight * set.reps), 0).toLocaleString()} kg
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};
