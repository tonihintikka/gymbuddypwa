import React from 'react';
import KpiCard from './KpiCard';

interface KpiGridProps {
  kpis: Array<{
    key: '1rm' | 'maxWeight' | 'volume' | 'reps';
    title: string;
    value: string | number;
    deltaPct?: number;
    trend?: 'up' | 'down' | 'flat';
    onClick?: () => void;
  }>;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ kpis }) => {
  return (
    <div className="kpi-grid">
      {kpis.map(k => (
        <KpiCard key={k.key} title={k.title} value={k.value} deltaPct={k.deltaPct} trend={k.trend} onClick={k.onClick} />
      ))}
    </div>
  );
};

export default KpiGrid;
