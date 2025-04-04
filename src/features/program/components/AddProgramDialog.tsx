import { AddProgramForm } from './AddProgramForm';

interface AddProgramDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, description?: string) => Promise<boolean>;
}

export const AddProgramDialog = ({ 
  isOpen, 
  onClose, 
  onAdd 
}: AddProgramDialogProps) => {
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
        <AddProgramForm onAdd={onAdd} onCancel={onClose} />
      </div>
    </div>
  );
};
