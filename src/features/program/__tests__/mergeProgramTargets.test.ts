import { describe, expect, it } from 'vitest';
import { Program } from '../../../types/models';
import { mergeMissingTargetRir } from '../mergeProgramTargets';
import { builtInPrograms } from '../hooks/usePrograms';

const code: Program = {
  id: 'five-day-40plus',
  name: '5-Day Recovery-Friendly (40+)',
  description: 'Updated description with RIR 2–3.',
  exercises: [],
  days: [
    {
      id: 'day1',
      name: 'Day 1 - Upper A',
      exercises: [
        { exerciseId: 'bench-press', targetSets: 3, targetReps: '8-10', targetRir: 3 },
        { exerciseId: 'dumbbell-curl', targetSets: 2, targetReps: '10-12', targetRir: 2 },
      ],
    },
  ],
};

describe('mergeMissingTargetRir', () => {
  it('fills targetRir on a saved program and keeps an exercise the user added', () => {
    const saved: Program = {
      ...code,
      description: 'A 5-day program designed for beginners over 40 with limited time. Focus on compounds, recovery, and leaving 1-2 reps in the tank. Upper/Lower style with lighter fifth day.',
      days: [
        {
          id: 'day1',
          name: 'Day 1 - Upper A',
          exercises: [
            { exerciseId: 'bench-press', targetSets: 3, targetReps: '8-10' },
            { exerciseId: 'dumbbell-curl', targetSets: 2, targetReps: '10-12', targetRir: 4 },
            { exerciseId: 'face-pull', targetSets: 2, targetReps: '15' },
          ],
        },
      ],
    };

    const merged = mergeMissingTargetRir(saved, code);

    expect(merged?.days?.[0].exercises).toEqual([
      { exerciseId: 'bench-press', targetSets: 3, targetReps: '8-10', targetRir: 3 },
      { exerciseId: 'dumbbell-curl', targetSets: 2, targetReps: '10-12', targetRir: 4 },
      { exerciseId: 'face-pull', targetSets: 2, targetReps: '15' },
    ]);
    expect(merged?.description).toBe(code.description);
  });

  it('does nothing when targets are already present', () => {
    const saved: Program = {
      ...code,
      days: [
        {
          id: 'day1',
          name: 'Day 1 - Upper A',
          exercises: [
            { exerciseId: 'bench-press', targetSets: 3, targetReps: '8-10', targetRir: 3 },
            { exerciseId: 'dumbbell-curl', targetSets: 2, targetReps: '10-12', targetRir: 2 },
          ],
        },
      ],
    };

    expect(mergeMissingTargetRir(saved, code)).toBeNull();
  });

  it('does not guess when one exercise id has two different targets', () => {
    const ambiguous: Program = {
      id: 'p',
      name: 'P',
      exercises: [
        { exerciseId: 'curl', targetRir: 2 },
        { exerciseId: 'curl', targetRir: 3 },
      ],
    };
    const saved: Program = {
      id: 'p',
      name: 'P',
      exercises: [
        { exerciseId: 'curl', targetSets: 2 },
        { exerciseId: 'curl', targetSets: 2 },
      ],
    };

    expect(mergeMissingTargetRir(saved, ambiguous)).toBeNull();
  });
});

describe('five-day recovery program seed', () => {
  it('stamps target RIR 2 or 3 on every exercise', () => {
    const program = builtInPrograms.find(item => item.id === 'five-day-40plus');
    expect(program?.days).toHaveLength(5);

    const targets = program!.days!.flatMap(day => day.exercises.map(exercise => exercise.targetRir));
    expect(targets.every(target => target === 2 || target === 3)).toBe(true);
    expect(targets).toContain(2);
    expect(targets).toContain(3);
    expect(program?.description).toContain('RIR 2–3');
  });
});
