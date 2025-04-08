import { useState, useEffect } from 'react';
import { useWorkout } from '../hooks/useWorkout';
import { usePrograms } from '../../program/hooks/usePrograms';
import { useExercises } from '../../exercise/hooks/useExercises';
import { WorkoutStartScreen } from './WorkoutStartScreen';
import { ActiveWorkoutScreen } from './ActiveWorkoutScreen';
import { WorkoutSummary } from './WorkoutSummary';
import { AddExerciseToWorkoutDialog } from './AddExerciseToWorkoutDialog';
import { SetLog, WorkoutLog } from '../../../types/models';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { STORES } from '../../../services/db';

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
  const { loadItems: refreshPrograms } = useIndexedDB(STORES.PROGRAMS);
  
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState('00:00:00');
  const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
  const [activeProgram, setActiveProgram] = useState<string | null>(null);
  
  // Get the active program object
  const programObject = activeProgram 
    ? programs.find(p => p.id === activeProgram) 
    : null;
  
  // Refresh programs when needed
  useEffect(() => {
    if (!currentWorkout && !workoutComplete) {
      refreshPrograms();
    }
  }, [currentWorkout, workoutComplete, refreshPrograms]);
  
  // Handle starting a workout from a program
  const handleStartProgram = async (programId: string) => {
    console.log("Starting program with ID:", programId);
    console.log("Found program:", programs.find(p => p.id === programId));
    
    const result = await startProgramWorkout(programId);
    console.log("Start program workout result:", result);
    
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
      
      // Store workout data before finalizing
      setCompletedWorkout({...currentWorkout});
      
      await finishWorkout();
      // Set workout complete with saved workout data
      setWorkoutComplete(true);
    }
  };
  
  // Handle closing the workout summary
  const handleCloseSummary = () => {
    setWorkoutComplete(false);
    setActiveProgram(null);
    refreshPrograms(); // Explicitly refresh programs when closing the summary
  };

  useEffect(() => {
    // When workout is completed and then closed, make sure to refresh the programs
    if (!workoutComplete) {
      refreshPrograms();
    }
  }, [workoutComplete, refreshPrograms]);
  
  // Store completed workout for summary display
  const [completedWorkout, setCompletedWorkout] = useState<WorkoutLog | null>(null);
  
  // Save workout when finishing
  useEffect(() => {
    if (currentWorkout && !completedWorkout) {
      setCompletedWorkout(currentWorkout);
    }
  }, [currentWorkout, completedWorkout]);
  
  // Determine what to render based on current state
  if (currentWorkout && !workoutComplete) {
    return (
      <>
        <ActiveWorkoutScreen
          workout={currentWorkout}
          exercises={exercises}
          program={programObject}
          activeExerciseIndex={activeExerciseIndex}
          onLogSet={handleLogSet}
          onDeleteSet={handleDeleteSet}
          onNextExercise={nextExercise}
          onPreviousExercise={previousExercise}
          onAddExercise={() => setIsAddExerciseDialogOpen(true)}
          onFinishWorkout={handleFinishWorkout}
        />
        
        <AddExerciseToWorkoutDialog
          isOpen={isAddExerciseDialogOpen}
          exercises={exercises}
          onAddExercise={handleAddExercise}
          onClose={() => setIsAddExerciseDialogOpen(false)}
        />
      </>
    );
  }
  
  if (workoutComplete) {
    // If we have a completedWorkout, use it for the summary
    return (
      <WorkoutSummary
        workout={completedWorkout || (currentWorkout as WorkoutLog)}
        exercises={exercises}
        programName={programObject?.name}
        duration={workoutDuration}
        onClose={handleCloseSummary}
      />
    );
  }
  
  return (
    <WorkoutStartScreen
      programs={programs}
      onStartProgram={handleStartProgram}
      onStartEmpty={handleStartEmpty}
    />
  );
};
