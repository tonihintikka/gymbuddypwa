import { useState } from 'react';

interface AddProgramFormProps {
  onAdd: (name: string, description?: string) => Promise<boolean>;
  onCancel?: () => void;
}

export const AddProgramForm = ({ onAdd, onCancel }: AddProgramFormProps) => {
  const [programName, setProgramName] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!programName.trim()) {
      setError('Program name cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await onAdd(
        programName, 
        programDescription.trim() ? programDescription : undefined
      );
      
      if (success) {
        setProgramName('');
        setProgramDescription('');
        if (onCancel) {
          onCancel();
        }
      } else {
        setError('Failed to create program');
      }
    } catch (err) {
      setError('An error occurred while creating the program');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-program-form">
      <h2>Create New Program</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="program-name">Program Name</label>
          <input
            id="program-name"
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            placeholder="Enter program name"
            disabled={isSubmitting}
            autoFocus
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="program-description">Description (Optional)</label>
          <textarea
            id="program-description"
            value={programDescription}
            onChange={(e) => setProgramDescription(e.target.value)}
            placeholder="Enter program description"
            disabled={isSubmitting}
            rows={3}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-actions">
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              disabled={isSubmitting}
              className="secondary"
            >
              Cancel
            </button>
          )}
          
          <button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Program'}
          </button>
        </div>
      </form>
    </div>
  );
};
