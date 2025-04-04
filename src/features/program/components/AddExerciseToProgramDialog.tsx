import { AddExerciseToProgramForm } from './AddExerciseToProgramForm';
import { Exercise } from '../../../types/models';

interface AddExerciseToProgramDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  onAdd: (exerciseId: string, targetSets?: number, targetReps?: string, notes?: string) => Promise<boolean>;
}

export const AddExerciseToProgramDialog = ({ 
  isOpen, 
  onClose, 
  exercises,
  onAdd 
}: AddExerciseToProgramDialogProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <AddExerciseToProgramForm 
          exercises={exercises} 
          onAdd={onAdd} 
          onCancel={onClose} 
        />
      </div>
    </div>
  );
};
