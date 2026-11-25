import { describe, expect, it } from 'vitest';
import { Program } from '../../../types/models';
import { resolveProgramExercise } from '../resolveProgramExercise';

const program: Program = {
  id: 'five-day-40plus',
  name: '5-Day',
  exercises: [],
  days: [
    {
      id: 'day1',
      name: 'Upper A',
      exercises: [
        { exerciseId: 'bench-press', targetSets: 3, targetReps: '8-10', targetRir: 3 },
      ],
    },
    {
      id: 'day2',
      name: 'Lower A',
      exercises: [
        { exerciseId: 'squat', targetSets: 3, targetReps: '8-10', targetRir: 3 },
      ],
    },
  ],
};

describe('resolveProgramExercise', () => {
  it('reads the target from the selected day, not the empty flat list', () => {
    expect(resolveProgramExercise(program, 'day2', 0, 'squat')?.targetRir).toBe(3);
    expect(resolveProgramExercise(program, 'day1', 0, 'bench-press')?.exerciseId).toBe('bench-press');
  });

  it('falls back to the flat list for programs without days', () => {
    const flat: Program = {
      id: 'flat',
      name: 'Flat',
      exercises: [{ exerciseId: 'squat', targetRir: 2 }],
    };
    expect(resolveProgramExercise(flat, undefined, 0, 'squat')?.targetRir).toBe(2);
  });

  it('returns undefined for an exercise that is not in the template', () => {
    expect(resolveProgramExercise(program, 'day1', 1, 'curl')).toBeUndefined();
  });
});
