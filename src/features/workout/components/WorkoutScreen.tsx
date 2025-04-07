import { useState, useEffect } from 'react';
import { useWorkout } from '../hooks/useWorkout';
import { usePrograms } from '../../program/hooks/usePrograms';
import { useExercises } from '../../exercise/hooks/useExercises';
import { WorkoutStartScreen } from './WorkoutStartScreen';
import { ActiveWorkoutScreen } from './ActiveWorkoutScreen';
import { WorkoutSummary } from './WorkoutSummary';
import { AddExerciseToWorkoutDialog } from './AddExerciseToWorkoutDialog';
import { SetLog } from '../../../types/models';

export const WorkoutScreen = () => {
  const { 
    currentWorkout, 
    activeExerciseIndex,
    startWorkout,
    startProgramWorkout,
    addExerciseToWorkout,
    logSet,
    deleteSet,
    nextExercise,
    previousExercise,
    finishWorkout
  } = useWorkout();
  
  const { programs } = usePrograms();
  const { exercises } = useExercises();
  
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState('00:00:00');
  const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
  const [activeProgram, setActiveProgram] = useState<string | null>(null);
  
  // Get the active program object
  const programObject = activeProgram 
    ? programs.find(p => p.id === activeProgram) 
    : null;
  
  // Handle starting a workout from a program
  const handleStartProgram = async (programId: string) => {
    await startProgramWorkout(programId);
    setActiveProgram(programId);
  };
  
  // Handle starting an empty workout
  const handleStartEmpty = () => {
    startWorkout();
    setActiveProgram(null);
  };
  
  // Handle logging a set
  const handleLogSet = (
    exerciseIndex: number, 
    weight: number, 
    reps: number, 
    isFailure?: boolean, 
    isPaused?: boolean, 
    isSlowEccentric?: boolean
  ) => {
    const setLog: SetLog = {
      weight,
      reps,
      isFailure,
      isPaused,
      isSlowEccentric
    };
    
    logSet(exerciseIndex, setLog);
  };
  
  // Handle deleting a set
  const handleDeleteSet = (exerciseIndex: number, setIndex: number) => {
    deleteSet(exerciseIndex, setIndex);
  };
  
  // Handle adding an exercise to the workout
  const handleAddExercise = (exerciseId: string) => {
    addExerciseToWorkout(exerciseId);
  };
  
  // Handle finishing the workout
  const handleFinishWorkout = async () => {
    if (currentWorkout) {
      // Calculate workout duration
      const startTime = new Date(currentWorkout.date);
      const endTime = new Date();
      const diff = endTime.getTime() - startTime.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setWorkoutDuration(duration);
      
      await finishWorkout();
      setWorkoutComplete(true);
    }
  };
  
  // Handle closing the workout summary
  const handleCloseSummary = () => {
    setWorkoutComplete(false);
    setActiveProgram(null);
  };

  return (
    <div className="workout-screen">
      {!currentWorkout && !workoutComplete && (
        <WorkoutStartScreen
          programs={programs}
          onStartProgram={handleStartProgram}
          onStartEmpty={handleStartEmpty}
        />
      )}
      
      {currentWorkout && !workoutComplete && (
        <ActiveWorkoutScreen
          workout={currentWorkout}
          program={programObject}
          exercises={exercises}
          activeExerciseIndex={activeExerciseIndex}
          onLogSet={handleLogSet}
          onDeleteSet={handleDeleteSet}
          onNextExercise={nextExercise}
          onPreviousExercise={previousExercise}
          onAddExercise={() => setIsAddExerciseDialogOpen(true)}
          onFinishWorkout={handleFinishWorkout}
        />
      )}
      
      {workoutComplete && currentWorkout && (
        <WorkoutSummary
          workout={currentWorkout}
          exercises={exercises}
          programName={programObject?.name}
          duration={workoutDuration}
          onClose={handleCloseSummary}
        />
      )}
      
      <AddExerciseToWorkoutDialog
        isOpen={isAddExerciseDialogOpen}
        onClose={() => setIsAddExerciseDialogOpen(false)}
        exercises={exercises}
        onAddExercise={handleAddExercise}
      />
    </div>
  );
};
