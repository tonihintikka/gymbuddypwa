import React, { useMemo, useState } from 'react';
import { Exercise } from '../../../types/models';

type GroupedMap = { [group: string]: Exercise[] };

interface ExercisePickerProps {
  groupedExercises: any; // accepts shape from useExercisesWithHistory or a plain grouped map
  selectedExerciseId: string;
  onSelect: (exerciseId: string) => void;
  onClose: () => void;
  open: boolean;
}

export const ExercisePicker: React.FC<ExercisePickerProps> = ({ groupedExercises, selectedExerciseId, onSelect, onClose, open }) => {
  const [filter, setFilter] = useState('');
  const lower = filter.trim().toLowerCase();

  // Normalize incoming groupedExercises into a simple group -> Exercise[] map
  const normalized: GroupedMap = useMemo(() => {
    if (!groupedExercises) return {};
    // Shape from useExercisesWithHistory: { withData: ExerciseWithHistory[], withoutData: ExerciseWithHistory[] }
    if ('withData' in groupedExercises && 'withoutData' in groupedExercises) {
      const map: GroupedMap = {};
      // Only include exercises with history and sets, sorted by workout count desc
      map['With Data'] = (groupedExercises.withData || [])
        .map((it: any) => it.exercise)
        .filter((ex: Exercise | null) => !!ex);
      // Optionally exclude those without data entirely based on user's preference
      // map['Other Exercises'] = (groupedExercises.withoutData || []).map((it: any) => it.exercise);
      return map;
    }
    // Already a grouped map
    return groupedExercises as GroupedMap;
  }, [groupedExercises]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  return (
    <div className="bottom-sheet" onClick={handleBackdrop}>
      <div className="bottom-sheet__container" role="dialog" aria-modal="true" aria-label="Select exercise">
        <div className="bottom-sheet__header">
          <h3>Select Exercise</h3>
          <button className="bottom-sheet__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="bottom-sheet__content">
          <input
            type="text"
            className="search-input"
            placeholder="Search exercises..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <div className="grouped-exercise-list">
            {Object.entries(normalized).map(([groupName, exs]) => {
              const filtered = exs.filter(e => e.name && e.name.toLowerCase().includes(lower));
              if (filtered.length === 0) return null;
              return (
                <div key={groupName} className="exercise-group">
                  <h4 className="group-name">{groupName}</h4>
                  <ul className="exercise-list">
                    {filtered.map(ex => (
                      <li key={ex.id} className={`exercise-item ${selectedExerciseId === ex.id ? 'active' : ''}`}
                          onClick={() => { onSelect(ex.id); onClose(); }}>
                        <div className="exercise-content">
                          <h3 className="exercise-name">{ex.name}</h3>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bottom-sheet__actions">
          <button className="secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ExercisePicker;
