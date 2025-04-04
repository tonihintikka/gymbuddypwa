import { useState } from 'react';
import { useExercises } from '../hooks/useExercises';
import { ExerciseList } from './ExerciseList';
import { AddExerciseDialog } from './AddExerciseDialog';
import { Exercise } from '../../../types/models';

export const ExerciseScreen = () => {
  const { 
    exercises, 
    loading, 
    error, 
    addExercise, 
    removeExercise 
  } = useExercises();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleAddExercise = async (name: string) => {
    const success = await addExercise(name);
    if (success) {
      setIsAddDialogOpen(false);
    }
    return success;
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      await removeExercise(exerciseId);
      if (selectedExercise?.id === exerciseId) {
        setSelectedExercise(null);
      }
    }
  };

  return (
    <div className="exercise-screen">
      {error && (
        <div className="error-banner">
          Error: {error}
        </div>
      )}
      
      <ExerciseList 
        exercises={exercises}
        loading={loading}
        onSelectExercise={setSelectedExercise}
        onAddExercise={() => setIsAddDialogOpen(true)}
        onDeleteExercise={handleDeleteExercise}
      />
      
      <AddExerciseDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddExercise}
      />
      
      {selectedExercise && (
        <div className="exercise-details">
          <h3>{selectedExercise.name}</h3>
          <p>Type: {selectedExercise.isCustom ? 'Custom' : 'Built-in'}</p>
          <button 
            className="close-details"
            onClick={() => setSelectedExercise(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
