
import React, { useState } from 'react';
import { useExercises } from '../../exercise/hooks/useExercises';
import { useExercisesWithHistory } from '../hooks/useExercisesWithHistory';
import { TimeRange, TimeRangePicker } from './TimeRangePicker';
import ExercisePicker from './ExercisePicker';
import { useProgressData } from '../hooks/useProgressData';
import KpiGrid from './KpiGrid';
import ChartCarousel from './ChartCarousel';
import './Progress.css';

const ProgressScreen: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [range, setRange] = useState<TimeRange>('30D');
  const [pickerOpen, setPickerOpen] = useState(false);
  
  const { exercises, loading: exercisesLoading } = useExercises();
  const { groupedExercises, loading: historyLoading } = useExercisesWithHistory(exercises);
  const { data, loading: progressLoading, error, deltas } = useProgressData(selectedExercise || null, range);

  const isLoading = exercisesLoading || historyLoading;

  const kpis = [
    { key: '1rm' as const, title: 'Est. 1RM', value: data.at(-1)?.estimated1RM ? Math.round(data.at(-1)!.estimated1RM) : 0, deltaPct: deltas.oneRm, trend: deltas.oneRm > 0 ? 'up' as const : deltas.oneRm < 0 ? 'down' as const : 'flat' as const },
    { key: 'maxWeight' as const, title: 'Max Weight', value: data.at(-1)?.maxWeight ? Math.round(data.at(-1)!.maxWeight) : 0, deltaPct: deltas.maxWeight, trend: deltas.maxWeight > 0 ? 'up' : deltas.maxWeight < 0 ? 'down' : 'flat' },
    { key: 'volume' as const, title: 'Total Volume', value: data.at(-1)?.totalVolume ? Math.round(data.at(-1)!.totalVolume) : 0, deltaPct: deltas.volume, trend: deltas.volume > 0 ? 'up' : deltas.volume < 0 ? 'down' : 'flat' },
    { key: 'reps' as const, title: 'Total Reps', value: data.at(-1)?.totalReps ? Math.round(data.at(-1)!.totalReps) : 0, deltaPct: deltas.reps, trend: deltas.reps > 0 ? 'up' : deltas.reps < 0 ? 'down' : 'flat' },
  ];

  return (
    <div className="progress-screen">
      <div className="progress-header">
        <div className="header-row">
          <h2>Progress</h2>
          <TimeRangePicker value={range} onChange={setRange} />
        </div>
        <button className="secondary" onClick={() => setPickerOpen(true)} aria-label="Select exercise">
          {selectedExercise ? exercises.find(e => e.id === selectedExercise)?.name : 'Choose exercise'}
        </button>
      </div>

      <ExercisePicker
        groupedExercises={groupedExercises}
        selectedExerciseId={selectedExercise}
        onSelect={setSelectedExercise}
        onClose={() => setPickerOpen(false)}
        open={pickerOpen}
      />

      {selectedExercise ? (
        <>
          <KpiGrid kpis={kpis} />
          {progressLoading ? (
            <p>Loading progress...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : data.length > 0 ? (
            <ChartCarousel
              charts={[
                { key: '1rm', title: 'Estimated 1RM', metric: 'estimated1RM' },
                { key: 'volume', title: 'Total Volume', metric: 'totalVolume' },
                { key: 'reps', title: 'Total Reps', metric: 'totalReps' },
              ]}
              data={data}
            />
          ) : (
            <p>No data available for this exercise.</p>
          )}
        </>
      ) : (
        <p>Select an exercise to view progress.</p>
      )}
    </div>
  );
};

export default ProgressScreen;
