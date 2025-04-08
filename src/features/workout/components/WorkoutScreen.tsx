import { useState, useEffect } from 'react';
import { useWorkout } from '../hooks/useWorkout';
import { usePrograms } from '../../program/hooks/usePrograms';
import { useExercises } from '../../exercise/hooks/useExercises';
import { WorkoutStartScreen } from './WorkoutStartScreen';
import { ActiveWorkoutScreen } from './ActiveWorkoutScreen';
import { WorkoutSummary } from './WorkoutSummary';
import { AddExerciseToWorkoutDialog } from './AddExerciseToWorkoutDialog';
import { SaveWorkoutAsProgramDialog } from './SaveWorkoutAsProgramDialog';
import { SetLog, WorkoutLog, ProgramExercise, LoggedExercise } from '../../../types/models';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { STORES } from '../../../services/db';
import { v4 as uuidv4 } from 'uuid';

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
  
  const { programs, createProgram, addExerciseToProgram } = usePrograms();
  const { exercises } = useExercises();
  const { loadItems: refreshPrograms } = useIndexedDB(STORES.PROGRAMS);
  
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState('00:00:00');
  const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
  const [activeProgram, setActiveProgram] = useState<string | null>(null);
  
  // For "Save as Program" feature
  const [completedWorkout, setCompletedWorkout] = useState<WorkoutLog | null>(null);
  const [isEmptyWorkout, setIsEmptyWorkout] = useState(false);
  const [isSaveAsProgramDialogOpen, setIsSaveAsProgramDialogOpen] = useState(false);
  
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
    setIsEmptyWorkout(true);
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
      // Important: We need to keep track of if this was started as an empty workout
      // to later offer the "Save as Program" option
      setCompletedWorkout({...currentWorkout});
      
      await finishWorkout();
      // Set workout complete with saved workout data
      setWorkoutComplete(true);
    }
  };
  
  // Handle closing the workout summary
  const handleCloseSummary = () => {
    if (isEmptyWorkout && completedWorkout && completedWorkout.loggedExercises.length > 0) {
      // If this was an empty (ad-hoc) workout with exercises, offer to save as a program
      setIsSaveAsProgramDialogOpen(true);
    } else {
      // Otherwise, reset all states
      resetWorkoutStates();
    }
  };

  // Reset all states related to workout
  const resetWorkoutStates = () => {
    setWorkoutComplete(false);
    setActiveProgram(null);
    setIsEmptyWorkout(false);
    setCompletedWorkout(null);
    refreshPrograms();
  };

  // Handle saving an empty workout as a program
  const handleSaveAsProgram = async (programName: string, loggedExercises: LoggedExercise[]) => {
    try {
      console.log("Starting to save workout as program:", programName);
      console.log("Exercises to save:", loggedExercises.length);
      
      // Use the existing createProgram function from usePrograms hook
      const success = await createProgram(programName);
      
      if (success) {
        // Manually load the programs to get fresh data
        await refreshPrograms();
        
        // Find our new program in the updated list
        // Use current programs - refreshPrograms() has updated it
        const newlyCreatedProgram = programs.find(p => p.name === programName);
        
        if (newlyCreatedProgram) {
          console.log("Created program:", newlyCreatedProgram.id, "with name:", programName);
          
          // Add each exercise from the workout to the program
          for (const loggedExercise of loggedExercises) {
            console.log("Adding exercise:", loggedExercise.exerciseId);
            const exerciseAdded = await addExerciseToProgram(
              newlyCreatedProgram.id,
              loggedExercise.exerciseId,
              loggedExercise.sets.length, // Use the number of sets as targetSets
              loggedExercise.sets[0]?.reps.toString() // Use reps from first set as targetReps
            );
            
            if (!exerciseAdded) {
              console.error("Failed to add exercise:", loggedExercise.exerciseId);
            }
          }
          
          // Final refresh to make sure we have all the changes
          await refreshPrograms();
          console.log("Successfully saved program with exercises");
        } else {
          console.error("Couldn't find newly created program after refresh");
        }
      } else {
        console.error("Failed to create program:", programName);
      }
      
      // Close the dialog and reset states
      setIsSaveAsProgramDialogOpen(false);
      resetWorkoutStates();
    } catch (error) {
      console.error('Error saving workout as program:', error);
      // Close the dialog but keep states in case user wants to try again
      setIsSaveAsProgramDialogOpen(false);
    }
  };
  
  // Close the save as program dialog without saving
  const handleCancelSaveAsProgram = () => {
    setIsSaveAsProgramDialogOpen(false);
    resetWorkoutStates();
  };

  useEffect(() => {
    // When workout is completed and then closed, make sure to refresh the programs
    if (!workoutComplete) {
      refreshPrograms();
    }
  }, [workoutComplete, refreshPrograms]);
  
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
      <>
        <WorkoutSummary
          workout={completedWorkout || (currentWorkout as WorkoutLog)}
          exercises={exercises}
          programName={programObject?.name}
          duration={workoutDuration}
          onClose={handleCloseSummary}
        />
        
        <SaveWorkoutAsProgramDialog
          isOpen={isSaveAsProgramDialogOpen}
          loggedExercises={completedWorkout?.loggedExercises || []}
          onSave={handleSaveAsProgram}
          onClose={handleCancelSaveAsProgram}
        />
      </>
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
