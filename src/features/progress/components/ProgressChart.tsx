
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  progressData: any[];
  selectedMetric: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ progressData, selectedMetric }) => {
  const chartData = {
    labels: progressData.map(data => new Date(data.date).toLocaleDateString()),
    datasets: [
      {
        label: selectedMetric,
        data: progressData.map(data => data[selectedMetric]),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default ProgressChart;
