import { useState } from 'react';
import { Program, Exercise } from '../../../types/models';
import { ProgramExerciseItem } from './ProgramExerciseItem';
import { AddExerciseToProgramDialog } from './AddExerciseToProgramDialog';
import { formatTargetRirRange } from '../../workout/rir';

interface ProgramDetailProps {
  program: Program;
  exercises: Exercise[];
  onAddExercise: (
    programId: string, 
    exerciseId: string, 
    targetSets?: number, 
    targetReps?: string, 
    notes?: string,
    targetRir?: number,
  ) => Promise<boolean>;
  onRemoveExercise: (programId: string, exerciseIndex: number) => Promise<boolean>;
  onBack: () => void;
}

export const ProgramDetail = ({
  program,
  exercises,
  onAddExercise,
  onRemoveExercise,
  onBack
}: ProgramDetailProps) => {
  const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find the full exercise object for each program exercise
  const programExercisesWithDetails = program.exercises.map((programExercise, index) => {
    const exercise = exercises.find(e => e.id === programExercise.exerciseId);
    return {
      programExercise,
      exercise,
      index
    };
  });

  const handleAddExercise = async (
    exerciseId: string, 
    targetSets?: number, 
    targetReps?: string, 
    notes?: string,
    targetRir?: number,
  ) => {
    setError(null);
    try {
      const success = await onAddExercise(
        program.id, 
        exerciseId, 
        targetSets, 
        targetReps, 
        notes,
        targetRir,
      );
      
      if (success) {
        setIsAddExerciseDialogOpen(false);
      } else {
        setError('Failed to add exercise to program');
      }
      
      return success;
    } catch (err) {
      setError('An error occurred while adding the exercise');
      console.error(err);
      return false;
    }
  };

  const handleRemoveExercise = async (exerciseIndex: number) => {
    setError(null);
    try {
      if (window.confirm('Are you sure you want to remove this exercise from the program?')) {
        await onRemoveExercise(program.id, exerciseIndex);
      }
    } catch (err) {
      setError('An error occurred while removing the exercise');
      console.error(err);
    }
  };

  const days = program.days ?? [];
  const showDays = days.length > 0;

  return (
    <div className="program-detail">
      <div className="program-detail-header">
        <button 
          className="back-button"
          onClick={onBack}
        >
          ← Back to Programs
        </button>
        <h2>{program.name}</h2>
        {program.description && (
          <p className="program-description">{program.description}</p>
        )}
      </div>
      
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}
      
      {showDays ? (
        <div className="program-days">
          {days.map(day => {
            const rirLabel = formatTargetRirRange(day.exercises);
            return (
              <section key={day.id} className="program-day">
                <h3 className="program-day-name">{day.name}</h3>
                {rirLabel && <p className="program-day-rir">{rirLabel}</p>}
                <div className="program-exercises-list">
                  {day.exercises.map((programExercise, index) => {
                    const exercise = exercises.find(item => item.id === programExercise.exerciseId);
                    if (!exercise) {
                      return (
                        <div key={`${day.id}-${index}`} className="missing-exercise">
                          Unknown exercise
                        </div>
                      );
                    }
                    return (
                      <ProgramExerciseItem
                        key={`${day.id}-${index}`}
                        programExercise={programExercise}
                        exercise={exercise}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <>
          <div className="program-exercises-header">
            <h3>Exercises</h3>
            <button
              className="add-exercise-btn"
              onClick={() => setIsAddExerciseDialogOpen(true)}
            >
              Add Exercise
            </button>
          </div>

          {programExercisesWithDetails.length === 0 ? (
            <div className="no-exercises">
              This program doesn't have any exercises yet. Add some exercises to get started.
            </div>
          ) : (
            <div className="program-exercises-list">
              {programExercisesWithDetails.map(({ programExercise, exercise, index }) => (
                exercise ? (
                  <ProgramExerciseItem
                    key={`${program.id}-${index}`}
                    programExercise={programExercise}
                    exercise={exercise}
                    onRemove={() => handleRemoveExercise(index)}
                  />
                ) : (
                  <div key={`${program.id}-${index}`} className="missing-exercise">
                    Unknown exercise
                    <button
                      className="remove-program-exercise-btn"
                      onClick={() => handleRemoveExercise(index)}
                    >
                      Remove
                    </button>
                  </div>
                )
              ))}
            </div>
          )}
        </>
      )}
      
      <AddExerciseToProgramDialog
        isOpen={isAddExerciseDialogOpen}
        onClose={() => setIsAddExerciseDialogOpen(false)}
        exercises={exercises}
        onAdd={handleAddExercise}
      />
    </div>
  );
};
