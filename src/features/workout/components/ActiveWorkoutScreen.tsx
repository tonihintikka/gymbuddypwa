import { useState, useEffect } from 'react';
import { WorkoutLog, Program, Exercise } from '../../../types/models';
import { ExerciseView } from './ExerciseView';

interface ActiveWorkoutScreenProps {
  workout: WorkoutLog;
  program?: Program | null;
  exercises: Exercise[];
  activeExerciseIndex: number;
  onLogSet: (exerciseIndex: number, weight: number, reps: number, isFailure?: boolean, isPaused?: boolean, isSlowEccentric?: boolean) => void;
  onDeleteSet: (exerciseIndex: number, setIndex: number) => void;
  onNextExercise: () => void;
  onPreviousExercise: () => void;
  onAddExercise: () => void;
  onFinishWorkout: () => void;
}

export const ActiveWorkoutScreen = ({
  workout,
  program,
  exercises,
  activeExerciseIndex,
  onLogSet,
  onDeleteSet,
  onNextExercise,
  onPreviousExercise,
  onAddExercise,
  onFinishWorkout
}: ActiveWorkoutScreenProps) => {
  const [startTime] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  
  // Update elapsed time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsedTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);
  
  // Get current exercise
  const currentLoggedExercise = workout.loggedExercises[activeExerciseIndex];
  
  if (!currentLoggedExercise) {
    return (
      <div className="no-exercises-message">
        <p>No exercises in this workout yet.</p>
        <button onClick={onAddExercise}>Add Exercise</button>
      </div>
    );
  }
  
  const currentExercise = exercises.find(e => e.id === currentLoggedExercise.exerciseId);
  
  if (!currentExercise) {
    return (
      <div className="error-message">
        <p>Exercise not found.</p>
        <button onClick={onNextExercise}>Skip to Next</button>
      </div>
    );
  }
  
  // Find program exercise if available
  const programExercise = program?.exercises[activeExerciseIndex];
  
  // Handle logging a set for the current exercise
  const handleLogSet = (weight: number, reps: number, isFailure?: boolean, isPaused?: boolean, isSlowEccentric?: boolean) => {
    onLogSet(activeExerciseIndex, weight, reps, isFailure, isPaused, isSlowEccentric);
  };
  
  // Handle deleting a set from the current exercise
  const handleDeleteSet = (setIndex: number) => {
    onDeleteSet(activeExerciseIndex, setIndex);
  };

  return (
    <div className="active-workout-screen">
      <div className="workout-header">
        <div className="workout-info">
          <h2>{program?.name || 'Workout'}</h2>
          <div className="workout-time">
            <span className="time-label">Time:</span>
            <span className="time-value">{elapsedTime}</span>
          </div>
        </div>
        
        <button 
          className="finish-workout-btn"
          onClick={onFinishWorkout}
        >
          Finish Workout
        </button>
      </div>
      
      <div className="exercise-navigation">
        <button 
          className="prev-exercise-btn"
          onClick={onPreviousExercise}
          disabled={activeExerciseIndex === 0}
        >
          Previous
        </button>
        <div className="exercise-position">
          {activeExerciseIndex + 1} / {workout.loggedExercises.length}
        </div>
        <button 
          className="next-exercise-btn"
          onClick={onNextExercise}
          disabled={activeExerciseIndex === workout.loggedExercises.length - 1}
        >
          Next
        </button>
      </div>
      
      <ExerciseView
        exercise={currentExercise}
        loggedExercise={currentLoggedExercise}
        programExercise={programExercise}
        onLogSet={handleLogSet}
        onDeleteSet={handleDeleteSet}
      />
      
      <div className="workout-actions">
        <button 
          className="add-exercise-btn"
          onClick={onAddExercise}
        >
          Add Exercise
        </button>
      </div>
    </div>
  );
};
