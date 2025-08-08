import { useState } from 'react';
import { usePrograms } from '../hooks/usePrograms';
import { useExercises } from '../../exercise/hooks/useExercises';
import { ProgramList } from './ProgramList';
import { AddProgramDialog } from './AddProgramDialog';
import { ProgramDetail } from './ProgramDetail';
import { Program } from '../../../types/models';

export const ProgramScreen = () => {
  const {
    programs,
    loading: programsLoading,
    error: programsError,
    createProgram,
    deleteProgram,
    addExerciseToProgram,
    removeExerciseFromProgram
  } = usePrograms();

  const { exercises } = useExercises();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const handleAddProgram = async (name: string, description?: string) => {
    const success = await createProgram(name, description);
    if (success) {
      setIsAddDialogOpen(false);
    }
    return success;
  };

  const handleDeleteProgram = async (programId: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      await deleteProgram(programId);
      if (selectedProgram?.id === programId) {
        setSelectedProgram(null);
      }
    }
  };

  const handleRemoveExerciseFromProgram = async (programId: string, exerciseIndex: number) => {
    const ok = await removeExerciseFromProgram(programId, exerciseIndex);
    if (ok) {
      setSelectedProgram(prev => {
        if (!prev || prev.id !== programId) return prev;
        const updated = { ...prev, exercises: prev.exercises.filter((_, i) => i !== exerciseIndex) };
        return updated;
      });
    }
    return ok;
  };

  const handleAddExerciseToProgram = async (
    programId: string,
    exerciseId: string,
    targetSets?: number,
    targetReps?: string,
    notes?: string
  ) => {
    const ok = await addExerciseToProgram(programId, exerciseId, targetSets, targetReps, notes);
    if (ok) {
      setSelectedProgram(prev => {
        if (!prev || prev.id !== programId) return prev;
        const newExercise = { exerciseId, targetSets, targetReps, notes };
        return { ...prev, exercises: [...prev.exercises, newExercise] };
      });
    }
    return ok;
  };

  return (
    <div className="program-screen feature-container">
      {programsError && (
        <div className="error-banner">
          Error: {programsError}
        </div>
      )}

      {selectedProgram ? (
        <ProgramDetail
          program={selectedProgram}
          exercises={exercises}
          onAddExercise={handleAddExerciseToProgram}
          onRemoveExercise={handleRemoveExerciseFromProgram}
          onBack={() => setSelectedProgram(null)}
        />
      ) : (
        <>
          <ProgramList
            programs={programs}
            loading={programsLoading}
            onSelectProgram={setSelectedProgram}
            onAddProgram={() => setIsAddDialogOpen(true)}
            onDeleteProgram={handleDeleteProgram}
          />

          <AddProgramDialog
            isOpen={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            onAdd={handleAddProgram}
          />
        </>
      )}
    </div>
  );
};
