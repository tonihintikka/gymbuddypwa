import { Program, ProgramExercise } from '../../types/models';

const LEGACY_FIVE_DAY_DESCRIPTION_SNIPPET = '1-2 reps in the tank';

function isFiniteRir(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Copy targetRir from the code definition onto a saved built-in program
 * where the saved exercise does not have one yet.
 *
 * Match by exercise id inside a day (or the flat list). If that id appears
 * twice with different targets, leave it alone. Existing targetRir values
 * are kept. Returns null when nothing changed.
 */
export function mergeMissingTargetRir(saved: Program, code: Program): Program | null {
  let changed = false;

  const mergeList = (
    savedList: ProgramExercise[] | undefined,
    codeList: ProgramExercise[] | undefined,
  ): ProgramExercise[] => {
    const savedExercises = savedList ?? [];
    const codeExercises = codeList ?? [];
    const targetById = new Map<string, number | 'ambiguous'>();

    for (const exercise of codeExercises) {
      if (!isFiniteRir(exercise.targetRir)) continue;
      const current = targetById.get(exercise.exerciseId);
      if (current == null) {
        targetById.set(exercise.exerciseId, exercise.targetRir);
      } else if (current !== exercise.targetRir) {
        targetById.set(exercise.exerciseId, 'ambiguous');
      }
    }

    return savedExercises.map(exercise => {
      if (isFiniteRir(exercise.targetRir)) return exercise;
      const target = targetById.get(exercise.exerciseId);
      if (target == null || target === 'ambiguous') return exercise;
      changed = true;
      return { ...exercise, targetRir: target };
    });
  };

  const exercises = mergeList(saved.exercises, code.exercises);

  let days = saved.days;
  if (saved.days && code.days) {
    days = saved.days.map(day => {
      const codeDay = code.days!.find(candidate => candidate.id === day.id);
      if (!codeDay) return day;
      return { ...day, exercises: mergeList(day.exercises, codeDay.exercises) };
    });
  }

  let description = saved.description;
  const codeDescription = code.description;
  const descriptionIsLegacy = !!saved.description?.includes(LEGACY_FIVE_DAY_DESCRIPTION_SNIPPET);
  if (codeDescription && saved.description !== codeDescription && (changed || descriptionIsLegacy)) {
    description = codeDescription;
    changed = true;
  }

  if (!changed) return null;
  return { ...saved, exercises, days, description };
}
