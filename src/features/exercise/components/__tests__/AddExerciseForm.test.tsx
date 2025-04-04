import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddExerciseForm } from '../AddExerciseForm';

describe('AddExerciseForm', () => {
  it('renders the form correctly', () => {
    render(<AddExerciseForm onAdd={async () => true} />);
    
    expect(screen.getByText('Add New Exercise')).toBeInTheDocument();
    expect(screen.getByLabelText('Exercise Name')).toBeInTheDocument();
    expect(screen.getByText('Add Exercise')).toBeInTheDocument();
  });

  it('shows cancel button when onCancel prop is provided', () => {
    render(<AddExerciseForm onAdd={async () => true} onCancel={() => {}} />);
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const handleCancel = vi.fn();
    render(<AddExerciseForm onAdd={async () => true} onCancel={handleCancel} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(handleCancel).toHaveBeenCalled();
  });

  it('shows error when submitting with empty exercise name', () => {
    render(<AddExerciseForm onAdd={async () => true} />);
    
    fireEvent.click(screen.getByText('Add Exercise'));
    
    expect(screen.getByText('Exercise name cannot be empty')).toBeInTheDocument();
  });

  it('calls onAdd with exercise name when form is submitted', async () => {
    const handleAdd = vi.fn().mockResolvedValue(true);
    render(<AddExerciseForm onAdd={handleAdd} />);
    
    fireEvent.change(screen.getByLabelText('Exercise Name'), { 
      target: { value: 'New Exercise' } 
    });
    
    fireEvent.click(screen.getByText('Add Exercise'));
    
    await waitFor(() => {
      expect(handleAdd).toHaveBeenCalledWith('New Exercise');
    });
  });

  it('shows loading state during submission', async () => {
    // Create a promise that we can resolve manually
    let resolvePromise: (value: boolean) => void;
    const addPromise = new Promise<boolean>(resolve => {
      resolvePromise = resolve;
    });
    
    const handleAdd = vi.fn().mockReturnValue(addPromise);
    render(<AddExerciseForm onAdd={handleAdd} />);
    
    fireEvent.change(screen.getByLabelText('Exercise Name'), { 
      target: { value: 'New Exercise' } 
    });
    
    fireEvent.click(screen.getByText('Add Exercise'));
    
    // Check that the button text changes to indicate loading
    expect(screen.getByText('Adding...')).toBeInTheDocument();
    
    // Resolve the promise to complete the submission
    resolvePromise!(true);
    
    await waitFor(() => {
      expect(screen.getByText('Add Exercise')).toBeInTheDocument();
    });
  });

  it('shows error message when add operation fails', async () => {
    const handleAdd = vi.fn().mockResolvedValue(false);
    render(<AddExerciseForm onAdd={handleAdd} />);
    
    fireEvent.change(screen.getByLabelText('Exercise Name'), { 
      target: { value: 'New Exercise' } 
    });
    
    fireEvent.click(screen.getByText('Add Exercise'));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to add exercise')).toBeInTheDocument();
    });
  });

  it('clears the input after successful submission', async () => {
    const handleAdd = vi.fn().mockResolvedValue(true);
    render(<AddExerciseForm onAdd={handleAdd} />);
    
    const input = screen.getByLabelText('Exercise Name');
    fireEvent.change(input, { target: { value: 'New Exercise' } });
    
    fireEvent.click(screen.getByText('Add Exercise'));
    
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });
});
