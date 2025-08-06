import { useState, useEffect } from 'react';
import { useWorkoutContext } from '../context/WorkoutContext';
import { usePrograms } from '../../program/hooks/usePrograms';
import { useExercises } from '../../exercise/hooks/useExercises';
import { WorkoutStartScreen } from './WorkoutStartScreen';
import { ActiveWorkoutScreen } from './ActiveWorkoutScreen';
import { WorkoutSummary } from './WorkoutSummary';
import { AddExerciseToWorkoutDialog } from './AddExerciseToWorkoutDialog';
import { SaveWorkoutAsProgramDialog } from './SaveWorkoutAsProgramDialog';
import { SetLog, WorkoutLog, LoggedExercise } from '../../../types/models';
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
  } = useWorkoutContext();

  const { programs, createProgram, addExerciseToProgram } = usePrograms();
  const { exercises } = useExercises();
  const { loadItems: refreshPrograms } = useIndexedDB(STORES.PROGRAMS);

  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState('00:00:00');
  const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
  const [activeProgram, setActiveProgram] = useState<string | null>(null);

  const [completedWorkout, setCompletedWorkout] = useState<WorkoutLog | null>(null);
  const [isEmptyWorkout, setIsEmptyWorkout] = useState(false);
  const [isSaveAsProgramDialogOpen, setIsSaveAsProgramDialogOpen] = useState(false);

  const programObject = activeProgram ? programs.find(p => p.id === activeProgram) : null;

  useEffect(() => {
    if (!currentWorkout && !workoutComplete) {
      refreshPrograms();
    }
  }, [currentWorkout, workoutComplete, refreshPrograms]);

  const handleStartProgram = async (programId: string) => {
    const result = await startProgramWorkout(programId);
    if (result) setActiveProgram(programId);
  };

  const handleStartEmpty = () => {
    startWorkout();
    setActiveProgram(null);
    setIsEmptyWorkout(true);
  };

  const handleLogSet = (exerciseIndex: number, weight: number, reps: number, isFailure?: boolean, isPaused?: boolean, isSlowEccentric?: boolean) => {
    const setLog: SetLog = { weight, reps, isFailure, isPaused, isSlowEccentric };
    logSet(exerciseIndex, setLog);
  };

  const handleDeleteSet = (exerciseIndex: number, setIndex: number) => {
    deleteSet(exerciseIndex, setIndex);
  };

  const handleAddExercise = (exerciseId: string) => {
    addExerciseToWorkout(exerciseId);
  };

  const handleFinishWorkout = async () => {
    if (currentWorkout) {
      const startTime = new Date(currentWorkout.date);
      const endTime = new Date();
      const diff = endTime.getTime() - startTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setWorkoutDuration(duration);
      setCompletedWorkout({ ...currentWorkout });
      await finishWorkout();
      setWorkoutComplete(true);
    }
  };

  const handleCloseSummary = () => {
    if (isEmptyWorkout && completedWorkout && completedWorkout.loggedExercises.length > 0) {
      setIsSaveAsProgramDialogOpen(true);
    } else {
      resetWorkoutStates();
    }
  };

  const resetWorkoutStates = () => {
    setWorkoutComplete(false);
    setActiveProgram(null);
    setIsEmptyWorkout(false);
    setCompletedWorkout(null);
    refreshPrograms();
  };

  const handleSaveAsProgram = async (programName: string, loggedExercises: LoggedExercise[]) => {
    try {
      const newProgram = await createProgram(programName);
      if (newProgram) {
        for (const loggedExercise of loggedExercises) {
          await addExerciseToProgram(newProgram.id, loggedExercise.exerciseId, loggedExercise.sets.length, loggedExercise.sets[0]?.reps.toString());
        }
        await refreshPrograms();
      }
      setIsSaveAsProgramDialogOpen(false);
      resetWorkoutStates();
    } catch (error) {
      console.error('Error saving workout as program:', error);
      setIsSaveAsProgramDialogOpen(false);
    }
  };

  const handleCancelSaveAsProgram = () => {
    setIsSaveAsProgramDialogOpen(false);
    resetWorkoutStates();
  };

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
