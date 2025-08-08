import { useEffect, useMemo, useState } from 'react';
import { LoggedExercise, WorkoutLog } from '../../../types/models';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { STORES } from '../../../services/db';
import type { TimeRange } from '../components/TimeRangePicker';

interface DailyPoint {
  date: string; // yyyy-mm-dd
  estimated1RM: number;
  maxWeight: number;
  totalVolume: number;
  totalReps: number;
}

export function useProgressData(exerciseId: string | null, range: TimeRange) {
  const { items: workouts, loading: itemsLoading, error: dbError } = useIndexedDB<WorkoutLog>(STORES.WORKOUT_LOGS);
  const [data, setData] = useState<DailyPoint[]>([]);

  useEffect(() => {
    try {
      const map = new Map<string, DailyPoint>();
      const cutoff = rangeToCutoff(range);
      for (const w of (workouts || [])) {
        const d = new Date(w.date);
        if (cutoff && d < cutoff) continue;
        const day = d.toISOString().slice(0, 10);
        let dp = map.get(day);
        if (!dp) {
          dp = { date: day, estimated1RM: 0, maxWeight: 0, totalVolume: 0, totalReps: 0 };
          map.set(day, dp);
        }
        for (const ex of w.loggedExercises) {
          if (exerciseId && ex.exerciseId !== exerciseId) continue;
          for (const set of ex.sets) {
            const est1rm = set.weight * (1 + set.reps / 30);
            dp.estimated1RM = Math.max(dp.estimated1RM, est1rm);
            dp.maxWeight = Math.max(dp.maxWeight, set.weight);
            dp.totalVolume += set.weight * set.reps;
            dp.totalReps += set.reps;
          }
        }
      }
      const points = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
      const ds = downsample(points, 60);
      setData(ds);
    } catch {
      // Swallow; dbError will surface
    }
  }, [workouts, exerciseId, range]);

  const deltas = useMemo(() => computeDeltas(data), [data]);

  return { data, loading: itemsLoading, error: dbError, deltas };
}

function rangeToCutoff(range: TimeRange): Date | null {
  const now = new Date();
  const d = new Date(now);
  if (range === '7D') d.setDate(now.getDate() - 7);
  else if (range === '30D') d.setDate(now.getDate() - 30);
  else if (range === '90D') d.setDate(now.getDate() - 90);
  else if (range === '1Y') d.setFullYear(now.getFullYear() - 1);
  else return null;
  return d;
}

function downsample<T>(points: T[], target: number): T[] {
  if (points.length <= target) return points;
  const step = points.length / target;
  const res: T[] = [];
  for (let i = 0; i < target; i++) {
    res.push(points[Math.floor(i * step)]);
  }
  return res;
}

function computeDeltas(points: DailyPoint[]) {
  if (points.length < 2) return { oneRm: 0, maxWeight: 0, volume: 0, reps: 0 };
  const first = points[0];
  const last = points[points.length - 1];
  const pct = (a: number, b: number) => (a === 0 ? 0 : Math.round(((b - a) / a) * 100));
  return {
    oneRm: pct(first.estimated1RM, last.estimated1RM),
    maxWeight: pct(first.maxWeight, last.maxWeight),
    volume: pct(first.totalVolume, last.totalVolume),
    reps: pct(first.totalReps, last.totalReps),
  };
}
