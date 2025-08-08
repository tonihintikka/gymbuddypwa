import React from 'react';

export type TimeRange = '7D' | '30D' | '90D' | '1Y' | 'ALL';

interface TimeRangePickerProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const ranges: TimeRange[] = ['7D', '30D', '90D', '1Y', 'ALL'];

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({ value, onChange }) => {
  return (
    <div className="time-range-picker" role="tablist" aria-label="Time range">
      {ranges.map(r => (
        <button
          key={r}
          role="tab"
          className={`range-chip ${value === r ? 'active' : ''}`}
          aria-selected={value === r}
          onClick={() => onChange(r)}
        >
          {r}
        </button>
      ))}
    </div>
  );
};

export default TimeRangePicker;
