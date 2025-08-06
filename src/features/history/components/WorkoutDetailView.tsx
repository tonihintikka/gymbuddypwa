import { useState, useEffect } from 'react';
import { WorkoutLog, Exercise, Program, SetLog } from '../../../types/models';
import { formatDate, formatTime } from '../../../utils/dateFormatters';

interface WorkoutDetailViewProps {
  workout: WorkoutLog;
  exercises: Exercise[];
  program?: Program | null;
  onBack: () => void;
  onSave: (updatedWorkout: WorkoutLog) => Promise<boolean>;
}

export const WorkoutDetailView = ({
  workout,
  exercises,
  program,
  onBack,
  onSave
}: WorkoutDetailViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorkout, setEditedWorkout] = useState<WorkoutLog>(workout);

  useEffect(() => {
    setEditedWorkout(workout);
  }, [workout]);

  const handleSetChange = (exerciseIndex: number, setIndex: number, field: keyof SetLog, value: any) => {
    const updatedWorkout = { ...editedWorkout };
    const updatedExercises = [...updatedWorkout.loggedExercises];
    const updatedSets = [...updatedExercises[exerciseIndex].sets];
    updatedSets[setIndex] = { ...updatedSets[setIndex], [field]: value };
    updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], sets: updatedSets };
    updatedWorkout.loggedExercises = updatedExercises;
    setEditedWorkout(updatedWorkout);
  };

  const handleSaveChanges = async () => {
    const success = await onSave(editedWorkout);
    if (success) {
      setIsEditing(false);
    }
  };

  const totalVolume = editedWorkout.loggedExercises.reduce((total, loggedExercise) => {
    return total + loggedExercise.sets.reduce((exerciseTotal, set) => {
      return exerciseTotal + (set.weight * set.reps);
    }, 0);
  }, 0);

  const totalSets = editedWorkout.loggedExercises.reduce((total, loggedExercise) => {
    return total + loggedExercise.sets.length;
  }, 0);

  const totalReps = editedWorkout.loggedExercises.reduce((total, loggedExercise) => {
    return total + loggedExercise.sets.reduce((exerciseTotal, set) => {
      return exerciseTotal + set.reps;
    }, 0);
  }, 0);

  return (
    <div className="workout-detail-view">
      <div className="workout-detail-content">
        <div className="workout-detail-header">
          <button className="back-button" onClick={onBack}>← Back to History</button>
          <h2>Workout Details</h2>
          <div className="workout-date-time">
            <div className="date">{formatDate(editedWorkout.date)}</div>
            <div className="time">{formatTime(editedWorkout.date)}</div>
          </div>
          {program && <div className="workout-program-name">Program: {program.name}</div>}
          {isEditing ? (
            <button onClick={handleSaveChanges}>Save Changes</button>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          )}
        </div>

        <div className="workout-summary-stats">
          <div className="stat-item">
            <div className="stat-value">{editedWorkout.loggedExercises.length}</div>
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
          {editedWorkout.loggedExercises.map((loggedExercise, exerciseIndex) => {
            const exercise = exercises.find(e => e.id === loggedExercise.exerciseId);
            if (!exercise) return <div key={exerciseIndex}>Exercise not found</div>;

            return (
              <div key={exerciseIndex} className="exercise-detail">
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
                        <td>
                          {isEditing ? (
                            <input type="number" value={set.weight} onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', parseInt(e.target.value))}/>
                          ) : (
                            `${set.weight} kg`
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input type="number" value={set.reps} onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', parseInt(e.target.value))}/>
                          ) : (
                            set.reps
                          )}
                        </td>
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
