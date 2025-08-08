import { ExerciseCategory, MuscleGroup } from '../../../types/models';

interface FiltersBottomSheetProps {
  open: boolean;
  onClose: () => void;
  values: { muscleGroup: MuscleGroup | 'All'; category: ExerciseCategory | 'All' };
  onChange: (values: { muscleGroup: MuscleGroup | 'All'; category: ExerciseCategory | 'All' }) => void;
  availableMuscleGroups: MuscleGroup[];
  availableCategories: ExerciseCategory[];
  onApply: () => void;
  onClear: () => void;
}

export const FiltersBottomSheet = ({ open, onClose, values, onChange, availableMuscleGroups, availableCategories, onApply, onClear }: FiltersBottomSheetProps) => {
  if (!open) return null;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="bottom-sheet" onClick={handleBackdrop}>
      <div className="bottom-sheet__container" role="dialog" aria-modal="true" aria-label="Filters">
        <div className="bottom-sheet__header">
          <h3>Filters</h3>
          <button className="bottom-sheet__close" onClick={onClose} aria-label="Close filters">×</button>
        </div>
        <div className="bottom-sheet__content">
          <div className="filter-group">
            <label className="filter-label" htmlFor="sheet-muscle">Muscle Group</label>
            <select
              id="sheet-muscle"
              value={values.muscleGroup}
              onChange={(e) => onChange({ ...values, muscleGroup: e.target.value as MuscleGroup | 'All' })}
              className="filter-select"
            >
              <option value="All">All Muscle Groups</option>
              {availableMuscleGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="sheet-category">Category</label>
            <select
              id="sheet-category"
              value={values.category}
              onChange={(e) => onChange({ ...values, category: e.target.value as ExerciseCategory | 'All' })}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bottom-sheet__actions">
          <button className="secondary" onClick={onClear} aria-label="Clear filters">Clear</button>
          <button className="primary" onClick={onApply} aria-label="Apply filters">Apply</button>
        </div>
      </div>
    </div>
  );
};
