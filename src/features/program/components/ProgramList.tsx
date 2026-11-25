import { useState } from 'react';
import { Program } from '../../../types/models';

interface ProgramListProps {
  programs: Program[];
  onSelectProgram?: (program: Program) => void;
  onAddProgram?: () => void;
  onDeleteProgram?: (programId: string) => void;
  loading?: boolean;
}

export const ProgramList = ({
  programs,
  onSelectProgram,
  onAddProgram,
  onDeleteProgram,
  loading = false,
}: ProgramListProps) => {
  const [filter, setFilter] = useState('');

  // Filter programs based on search input
  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading programs...</div>;
  }

  return (
    <div className="program-list-container">
      <h2>Workout Programs</h2>
      <div className="program-search">
        <input
          type="text"
          placeholder="Search programs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <button
        className="add-program-btn"
        onClick={onAddProgram}
      >
        Create Program
      </button>

      {filteredPrograms.length === 0 ? (
        <div className="no-programs">
          {filter ?
            `No programs found matching "${filter}"` :
            'No programs available. Create your first workout program!'}
        </div>
      ) : (
        <ul className="program-list">
          {filteredPrograms.map(program => {
            const hasDays = !!program.days && program.days.length > 0;
            const exerciseCount = hasDays
              ? program.days!.reduce((sum, day) => sum + day.exercises.length, 0)
              : program.exercises.length;
            const countLabel = hasDays
              ? `${program.days!.length} days • ${exerciseCount} exercises`
              : `${exerciseCount} ${exerciseCount === 1 ? 'exercise' : 'exercises'}`;

            return (
            <li
              key={program.id}
              className="program-item"
              onClick={() => onSelectProgram && onSelectProgram(program)}
            >
              <div className="program-info">
                <span className="program-name">{program.name}</span>
                <span className="program-exercises-count">
                  {countLabel}
                </span>
              </div>
              {onDeleteProgram && (
                <button
                  className="delete-program-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProgram(program.id);
                  }}
                >
                  Delete
                </button>
              )}
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
