
import React from 'react';

interface MetricToggleProps {
  selectedMetric: string;
  onSelectMetric: (metric: string) => void;
}

const metrics = [
  { key: 'estimated1RM', label: 'Estimated 1RM' },
  { key: 'maxWeight', label: 'Max Weight' },
  { key: 'totalVolume', label: 'Total Volume' },
  { key: 'totalReps', label: 'Total Reps' },
];

const MetricToggle: React.FC<MetricToggleProps> = ({ selectedMetric, onSelectMetric }) => {
  return (
    <div>
      {metrics.map(metric => (
        <button 
          key={metric.key} 
          onClick={() => onSelectMetric(metric.key)}
          style={{ fontWeight: selectedMetric === metric.key ? 'bold' : 'normal' }}
        >
          {metric.label}
        </button>
      ))}
    </div>
  );
};

export default MetricToggle;
