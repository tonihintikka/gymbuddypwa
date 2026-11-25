import { Program, ProgramExercise } from '../../types/models';

/**
 * Program exercise for the set currently on screen.
 * Multi-day programs keep targets on the day, not the flat list
 * (that list is often empty). Match index first, then exercise id.
 */
export function resolveProgramExercise(
  program: Program | null | undefined,
  dayId: string | undefined,
  exerciseIndex: number,
  exerciseId: string,
): ProgramExercise | undefined {
  if (!program) return undefined;

  let list = program.exercises ?? [];
  if (program.days && program.days.length > 0) {
    const day = (dayId && program.days.find(candidate => candidate.id === dayId)) || program.days[0];
    list = day.exercises;
  }

  const byIndex = list[exerciseIndex];
  if (byIndex && byIndex.exerciseId === exerciseId) return byIndex;
  return list.find(exercise => exercise.exerciseId === exerciseId);
}
