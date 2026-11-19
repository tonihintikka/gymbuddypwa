import { useState } from 'react';
import { Program } from '../../../types/models';

interface WorkoutStartScreenProps {
  programs: Program[];
  onStartProgram: (programId: string, dayId?: string) => void;
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
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading programs...</div>;
  }

  // Day selection view
  if (selectedProgram && selectedProgram.days && selectedProgram.days.length > 0) {
    return (
      <div className="workout-start-screen">
        <div className="workout-start-header">
          <button
            className="back-button"
            onClick={() => setSelectedProgram(null)}
          >
            ← Back
          </button>
          <h2>{selectedProgram.name}</h2>
          <p>Select a day to start</p>
        </div>

        <ul className="program-list">
          {selectedProgram.days.map(day => (
            <li
              key={day.id}
              className="program-item"
              onClick={() => onStartProgram(selectedProgram.id, day.id)}
            >
              <div className="program-info">
                <span className="program-name">{day.name}</span>
                <span className="program-exercises-count">
                  {day.exercises.length} exercises
                </span>
              </div>
              <button
                className="start-program-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartProgram(selectedProgram.id, day.id);
                }}
              >
                Start
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="workout-start-screen">
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
            {filteredPrograms.map(program => {
              const hasDays = program.days && program.days.length > 0;
              const exerciseCount = hasDays
                ? program.days!.reduce((sum, d) => sum + d.exercises.length, 0)
                : program.exercises.length;

              return (
                <li
                  key={program.id}
                  className="program-item"
                  onClick={() => {
                    if (hasDays) {
                      setSelectedProgram(program);
                    } else {
                      onStartProgram(program.id);
                    }
                  }}
                >
                  <div className="program-info">
                    <span className="program-name">{program.name}</span>
                    <span className="program-exercises-count">
                      {hasDays
                        ? `${program.days!.length} days • ${exerciseCount} exercises`
                        : `${exerciseCount} ${exerciseCount === 1 ? 'exercise' : 'exercises'}`}
                    </span>
                  </div>
                  <button
                    className="start-program-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasDays) {
                        setSelectedProgram(program);
                      } else {
                        onStartProgram(program.id);
                      }
                    }}
                  >
                    {hasDays ? 'Select Day' : 'Start'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
