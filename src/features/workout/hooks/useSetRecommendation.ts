import { useMemo } from 'react';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { WorkoutLog } from '../../../types/models';
import { STORES } from '../../../services/db';
import { findLastSetWithRir, recommendFromLastRir, SetRecommendation } from '../rir';

/**
 * Suggestion for the next session of this exercise, from the last
 * saved set that has an RIR. The in-progress workout is not in IndexedDB
 * yet, so today's sets do not affect the hint.
 */
export function useSetRecommendation(
  exerciseId: string | undefined,
  targetRir?: number,
): SetRecommendation | null {
  const { items } = useIndexedDB<WorkoutLog>(STORES.WORKOUT_LOGS);

  return useMemo(() => {
    if (!exerciseId) return null;
    const last = findLastSetWithRir(items, exerciseId);
    if (!last) return null;
    return recommendFromLastRir(last.weight, last.rir, { targetRir });
  }, [items, exerciseId, targetRir]);
}
