import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  deltaPct?: number; // positive or negative
  trend?: 'up' | 'down' | 'flat';
  onClick?: () => void;
  children?: React.ReactNode; // sparkline slot
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, deltaPct, trend = 'flat', onClick, children }) => {
  const sign = typeof deltaPct === 'number' ? (deltaPct > 0 ? '+' : deltaPct < 0 ? '' : '') : '';
  const arrow = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—';

  return (
    <button className="kpi-card" onClick={onClick} aria-label={`${title} ${value}${typeof deltaPct === 'number' ? `, ${sign}${Math.abs(deltaPct)} percent` : ''}`}>
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        <span className={`kpi-delta ${trend}`}>{typeof deltaPct === 'number' ? `${arrow} ${sign}${Math.abs(deltaPct)}%` : ''}</span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sparkline" aria-hidden>{children}</div>
    </button>
  );
};

export default KpiCard;
