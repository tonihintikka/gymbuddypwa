import { useState } from 'react';
import { LoggedExercise } from '../../../types/models';

interface SaveWorkoutAsProgramDialogProps {
  isOpen: boolean;
  loggedExercises: LoggedExercise[];
  onSave: (programName: string, exercises: LoggedExercise[]) => void;
  onClose: () => void;
}

export const SaveWorkoutAsProgramDialog = ({
  isOpen,
  loggedExercises,
  onSave,
  onClose
}: SaveWorkoutAsProgramDialogProps) => {
  const [programName, setProgramName] = useState('');
  
  // Don't render if not open
  if (!isOpen) {
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (programName.trim()) {
      onSave(programName, loggedExercises);
      setProgramName(''); // Reset the name after saving
    }
  };
  
  const handleCancel = () => {
    setProgramName(''); // Reset the name when canceling
    onClose();
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>Save as Program</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            <p>Would you like to save this workout as a program template?</p>
            
            <div className="form-group">
              <label htmlFor="program-name">Program Name</label>
              <input
                id="program-name"
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="Enter program name"
                required
                autoFocus
              />
            </div>
            
            <div className="exercise-count">
              <span>Exercises: {loggedExercises.length}</span>
            </div>
          </div>
          
          <div className="dialog-actions">
            <button 
              type="button" 
              className="secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!programName.trim()}
            >
              Save Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 