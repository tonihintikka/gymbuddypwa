import { describe, expect, it } from 'vitest';
import { WorkoutLog } from '../../../types/models';
import {
  findLastSetWithRir,
  formatKg,
  formatTargetRirRange,
  recommendFromLastRir,
} from '../rir';

const log = (
  id: string,
  date: string,
  sets: { weight: number; reps: number; rir?: number }[],
  exerciseId = 'squat',
): WorkoutLog => ({
  id,
  date: new Date(date),
  loggedExercises: [{ exerciseId, sets }],
});

describe('recommendFromLastRir', () => {
  it('keeps the weight and asks for an easier stop when RIR was 0 or 1', () => {
    const low = recommendFromLastRir(60, 0, { targetRir: 3 });
    const one = recommendFromLastRir(60, 1, { targetRir: 3 });

    expect(low).toMatchObject({ action: 'ease-up', suggestedWeight: 60, lastRir: 0 });
    expect(one).toMatchObject({ action: 'ease-up', suggestedWeight: 60, lastRir: 1 });
    expect(low?.message).toContain('Keep 60 kg');
    expect(low?.message).toContain('aim RIR 3');
    expect(one?.message).toContain('stop sooner');
  });

  it('keeps the weight when the last RIR was 2', () => {
    const result = recommendFromLastRir(40, 2);

    expect(result).toMatchObject({ action: 'keep', suggestedWeight: 40 });
    expect(result?.message).toContain('Keep 40 kg');
  });

  it('adds 2.5 kg when the last RIR was 3 or more', () => {
    const three = recommendFromLastRir(60, 3);
    const five = recommendFromLastRir(17.5, 5);

    expect(three).toMatchObject({ action: 'increase', suggestedWeight: 62.5 });
    expect(three?.message).toContain('62.5 kg');
    expect(three?.message).toContain('+2.5 kg');
    expect(five).toMatchObject({ action: 'increase', suggestedWeight: 20 });
  });

  it('rejects an RIR outside 0–5', () => {
    expect(recommendFromLastRir(60, -1)).toBeNull();
    expect(recommendFromLastRir(60, 6)).toBeNull();
  });
});

describe('findLastSetWithRir', () => {
  it('uses the last RIR in the newest session and skips sessions that omitted it', () => {
    const logs = [
      log('older', '2026-01-01', [
        { weight: 40, reps: 8, rir: 3 },
      ]),
      log('latest-without-rir', '2026-02-01', [
        { weight: 50, reps: 8 },
      ]),
      log('middle', '2026-01-15', [
        { weight: 42.5, reps: 8, rir: 4 },
        { weight: 42.5, reps: 6, rir: 1 },
      ]),
    ];

    expect(findLastSetWithRir(logs, 'squat')).toEqual({
      weight: 42.5,
      rir: 1,
      reps: 6,
      workoutId: 'middle',
    });
  });

  it('can ignore a workout id', () => {
    const logs = [
      log('current', '2026-03-01', [{ weight: 70, reps: 5, rir: 0 }]),
      log('previous', '2026-02-01', [{ weight: 60, reps: 8, rir: 3 }]),
    ];

    expect(findLastSetWithRir(logs, 'squat', { excludeWorkoutId: 'current' })?.workoutId).toBe('previous');
  });

  it('returns null when this exercise has never recorded RIR', () => {
    expect(findLastSetWithRir([log('a', '2026-01-01', [{ weight: 20, reps: 10 }])], 'squat')).toBeNull();
    expect(findLastSetWithRir([], 'squat')).toBeNull();
  });
});

describe('RIR formatting', () => {
  it('formats kilograms without a trailing zero', () => {
    expect(formatKg(60)).toBe('60');
    expect(formatKg(62.5)).toBe('62.5');
  });

  it('summarises a target RIR range', () => {
    expect(formatTargetRirRange([{ targetRir: 3 }, { targetRir: 2 }, {}])).toBe('RIR 2–3');
    expect(formatTargetRirRange([{ targetRir: 3 }, { targetRir: 3 }])).toBe('RIR 3');
    expect(formatTargetRirRange([{}])).toBeNull();
  });
});
