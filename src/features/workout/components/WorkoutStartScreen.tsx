import { useState } from 'react';
import { Program } from '../../../types/models';

interface WorkoutStartScreenProps {
  programs: Program[];
  onStartProgram: (programId: string) => void;
  onStartEmpty: () => void;
  loading?: boolean;
}

export const WorkoutStartScreen = ({
  programs,
  onStartProgram,
  onStartEmpty,
  loading = false,
}: WorkoutStartScreenProps) => {
  const [filter, setFilter] = useState('');

  // Filter programs based on search input
  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading programs...</div>;
  }

  return (
    <div className="workout-start-screen feature-container">
      <div className="workout-start-header">
        <h2>Start Workout</h2>
        <button
          className="start-empty-workout-btn"
          onClick={onStartEmpty}
        >
          Start Empty Workout
        </button>
      </div>

      <div className="workout-program-section">
        <h3>Or select a program:</h3>

        <div className="program-search">
          <input
            type="text"
            placeholder="Search programs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="no-programs">
            {filter ?
              `No programs found matching "${filter}"` :
              'No programs available. Create a program first.'}
          </div>
        ) : (
          <ul className="program-list">
            {filteredPrograms.map(program => (
              <li
                key={program.id}
                className="program-item"
                onClick={() => onStartProgram(program.id)}
              >
                <div className="program-info">
                  <span className="program-name">{program.name}</span>
                  <span className="program-exercises-count">
                    {program.exercises.length} {program.exercises.length === 1 ? 'exercise' : 'exercises'}
                  </span>
                </div>
                <button
                  className="start-program-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartProgram(program.id);
                  }}
                >
                  Start
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
