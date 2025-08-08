import { ActiveChip } from '../hooks/useExerciseFilters';

interface FilterChipsProps {
  chips: ActiveChip[];
  onClearAll?: () => void;
}

export const FilterChips = ({ chips, onClearAll }: FilterChipsProps) => {
  if (!chips.length && !onClearAll) return null;

  return (
    <div className="filter-chips" role="list">
      {chips.map(chip => (
        <button
          key={chip.key}
          role="listitem"
          className="chip"
          onClick={chip.onRemove}
          aria-label={`Remove ${chip.label} filter`}
        >
          {chip.label}
          <span className="chip-close" aria-hidden>×</span>
        </button>
      ))}
      {chips.length > 0 && onClearAll && (
        <button className="chip chip--clear" onClick={onClearAll} aria-label="Clear all filters">
          Clear All
        </button>
      )}
    </div>
  );
};
