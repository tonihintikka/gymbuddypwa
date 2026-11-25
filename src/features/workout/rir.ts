/**
 * RIR (reps in reserve) helpers.
 *
 * Load jumps are 2.5 kg: the logger is metric, and 2.5 kg is one 1.25 kg
 * plate per side, the smallest usual barbell change. A 5 kg jump is a lot
 * for someone returning to training; it tends to turn an RIR 3 set into
 * an RIR 0 set. The number is a hint. The user still chooses the weight.
 */
import { WorkoutLog } from '../../types/models';

export const DEFAULT_WEIGHT_INCREMENT_KG = 2.5;

export type RecommendationAction = 'ease-up' | 'keep' | 'increase';

export interface SetRecommendation {
  action: RecommendationAction;
  lastWeight: number;
  lastRir: number;
  suggestedWeight: number;
  message: string;
}

export interface LastRirSet {
  weight: number;
  rir: number;
  reps: number;
  workoutId: string;
}

export function formatKg(weight: number): string {
  const rounded = Math.round(weight * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function isLoggedRir(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 5;
}

/**
 * Most recent saved set of this exercise that has an RIR.
 * Sessions with the exercise but no RIR are skipped.
 * Within a session, the last set that recorded RIR wins.
 */
export function findLastSetWithRir(
  logs: WorkoutLog[],
  exerciseId: string,
  options?: { excludeWorkoutId?: string },
): LastRirSet | null {
  const sorted = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  for (const log of sorted) {
    if (options?.excludeWorkoutId && log.id === options.excludeWorkoutId) continue;

    const matches = log.loggedExercises.filter(entry => entry.exerciseId === exerciseId);
    for (let entryIndex = matches.length - 1; entryIndex >= 0; entryIndex -= 1) {
      const sets = matches[entryIndex].sets;
      for (let setIndex = sets.length - 1; setIndex >= 0; setIndex -= 1) {
        const set = sets[setIndex];
        if (!isLoggedRir(set.rir)) continue;
        return {
          weight: set.weight,
          rir: set.rir,
          reps: set.reps,
          workoutId: log.id,
        };
      }
    }
  }

  return null;
}

export function recommendFromLastRir(
  lastWeight: number,
  lastRir: number,
  options?: { targetRir?: number; incrementKg?: number },
): SetRecommendation | null {
  if (!isLoggedRir(lastRir) || !Number.isFinite(lastWeight) || lastWeight < 0) {
    return null;
  }

  const increment = options?.incrementKg ?? DEFAULT_WEIGHT_INCREMENT_KG;
  const weightLabel = `${formatKg(lastWeight)} kg`;
  const aim = options?.targetRir != null ? `RIR ${options.targetRir}` : 'RIR 2–3';

  if (lastRir <= 1) {
    return {
      action: 'ease-up',
      lastWeight,
      lastRir,
      suggestedWeight: lastWeight,
      message: `Last time ${weightLabel} felt like RIR ${lastRir}. Keep ${weightLabel} and stop sooner (aim ${aim}).`,
    };
  }

  if (lastRir >= 3) {
    const suggestedWeight = Math.round((lastWeight + increment) * 10) / 10;
    return {
      action: 'increase',
      lastWeight,
      lastRir,
      suggestedWeight,
      message: `Last time ${weightLabel} was RIR ${lastRir}. Try ${formatKg(suggestedWeight)} kg (+${formatKg(increment)} kg).`,
    };
  }

  return {
    action: 'keep',
    lastWeight,
    lastRir,
    suggestedWeight: lastWeight,
    message: `Last time ${weightLabel} was RIR ${formatKg(lastRir)}. Keep ${weightLabel}.`,
  };
}

/** "RIR 2" or "RIR 2–3" when a template stamps a target. Null if none do. */
export function formatTargetRirRange(exercises: { targetRir?: number }[]): string | null {
  const values = exercises
    .map(exercise => exercise.targetRir)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `RIR ${min}` : `RIR ${min}–${max}`;
}
