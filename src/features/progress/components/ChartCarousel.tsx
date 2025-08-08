import React, { useState } from 'react';
import ProgressChart from './ProgressChart';

interface ChartSpec {
  key: string;
  title: string;
  metric: 'estimated1RM' | 'maxWeight' | 'totalVolume' | 'totalReps';
}

interface ChartCarouselProps {
  charts: ChartSpec[];
  data: any[]; // same format as ProgressChart expects
}

export const ChartCarousel: React.FC<ChartCarouselProps> = ({ charts, data }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % charts.length);
  const prev = () => setIndex((i) => (i - 1 + charts.length) % charts.length);

  const spec = charts[index];

  return (
    <div className="chart-carousel">
      <div className="carousel-header">
        <h3>{spec.title}</h3>
        <div className="carousel-actions">
          <button aria-label="Previous chart" onClick={prev}>‹</button>
          <button aria-label="Next chart" onClick={next}>›</button>
        </div>
      </div>
      <ProgressChart progressData={data} selectedMetric={spec.metric} />
      <div className="carousel-dots" role="tablist" aria-label="Charts">
        {charts.map((c, i) => (
          <button key={c.key} role="tab" aria-selected={i === index} className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} aria-label={c.title} />
        ))}
      </div>
    </div>
  );
};

export default ChartCarousel;
