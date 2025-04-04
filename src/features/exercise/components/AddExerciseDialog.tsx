import { AddExerciseForm } from './AddExerciseForm';

interface AddExerciseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => Promise<boolean>;
}

export const AddExerciseDialog = ({ 
  isOpen, 
  onClose, 
  onAdd 
}: AddExerciseDialogProps) => {
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
        <AddExerciseForm onAdd={onAdd} onCancel={onClose} />
      </div>
    </div>
  );
};
