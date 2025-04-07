import { useState } from 'react';
import { WorkoutLog } from '../../../types/models';
import { formatDate, formatTime } from '../../../utils/dateFormatters';

interface HistoryListProps {
  workoutLogs: WorkoutLog[];
  onSelectWorkout: (workoutId: string) => void;
  onDeleteWorkout?: (workoutId: string) => void;
  loading?: boolean;
}

export const HistoryList = ({
  workoutLogs,
  onSelectWorkout,
  onDeleteWorkout,
  loading = false,
}: HistoryListProps) => {
  const [dateFilter, setDateFilter] = useState<string>('');

  // Filter workouts based on date
  const filteredWorkoutLogs = dateFilter
    ? workoutLogs.filter(log => {
        const logDate = new Date(log.date);
        const filterDate = new Date(dateFilter);
        return (
          logDate.getFullYear() === filterDate.getFullYear() &&
          logDate.getMonth() === filterDate.getMonth() &&
          logDate.getDate() === filterDate.getDate()
        );
      })
    : workoutLogs;

  if (loading) {
    return <div className="loading">Loading workout history...</div>;
  }

  return (
    <div className="history-list-container">
      <h2>Workout History</h2>
      <div className="date-filter">
        <label htmlFor="date-filter">Filter by date:</label>
        <div className="filter-input-row">
          <input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          {dateFilter && (
            <button
              className="clear-filter-btn"
              onClick={() => setDateFilter('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredWorkoutLogs.length === 0 ? (
        <div className="no-workouts">
          {dateFilter
            ? `No workouts found on ${new Date(dateFilter).toLocaleDateString()}`
            : 'No workout history available. Complete your first workout!'}
        </div>
      ) : (
        <ul className="workout-list">
          {filteredWorkoutLogs.map(workout => (
            <li
              key={workout.id}
              className="workout-item"
              onClick={() => onSelectWorkout(workout.id)}
            >
              <div className="workout-info">
                <div className="workout-date">
                  <span className="date">{formatDate(workout.date)}</span>
                  <span className="time">{formatTime(workout.date)}</span>
                </div>
                <div className="workout-stats">
                  <span className="exercises-count">
                    {workout.loggedExercises.length} {workout.loggedExercises.length === 1 ? 'exercise' : 'exercises'}
                  </span>
                  <span className="sets-count">
                    {workout.loggedExercises.reduce((total, exercise) => total + exercise.sets.length, 0)} sets
                  </span>
                </div>
                {workout.programId && (
                  <div className="workout-program">
                    <span className="program-label">Program:</span>
                    <span className="program-id">{workout.programId}</span>
                  </div>
                )}
              </div>
              {onDeleteWorkout && (
                <button
                  className="delete-workout-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this workout?')) {
                      onDeleteWorkout(workout.id);
                    }
                  }}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
