/**
 * Core data models for the GymTrack PWA application
 */

/**
 * Represents an exercise definition
 */
export interface Exercise {
  id: string;
  name: string;
  isCustom: boolean;
}

/**
 * Represents a single set of an exercise
 */
export interface SetLog {
  weight: number;
  reps: number;
  isFailure?: boolean;
  isPaused?: boolean;
  isSlowEccentric?: boolean;
}

/**
 * Represents an exercise performed during a workout
 */
export interface LoggedExercise {
  exerciseId: string;
  sets: SetLog[];
}

/**
 * Represents a completed workout
 */
export interface WorkoutLog {
  id: string;
  date: Date;
  loggedExercises: LoggedExercise[];
  programId?: string;
}

/**
 * Represents an exercise within a program template
 */
export interface ProgramExercise {
  exerciseId: string;
  targetSets?: number;
  targetReps?: string; // e.g., "5" or "8-12"
  notes?: string;
}

/**
 * Represents a workout program template
 */
export interface Program {
  id: string;
  name: string;
  description?: string;
  exercises: ProgramExercise[];
}
