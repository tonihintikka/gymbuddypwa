import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddProgramForm } from '../AddProgramForm';

describe('AddProgramForm', () => {
  it('renders the form correctly', () => {
    render(<AddProgramForm onAdd={async () => true} />);
    
    expect(screen.getByText('Create New Program')).toBeInTheDocument();
    expect(screen.getByLabelText('Program Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Create Program')).toBeInTheDocument();
  });

  it('shows cancel button when onCancel prop is provided', () => {
    render(<AddProgramForm onAdd={async () => true} onCancel={() => {}} />);
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const handleCancel = vi.fn();
    render(<AddProgramForm onAdd={async () => true} onCancel={handleCancel} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(handleCancel).toHaveBeenCalled();
  });

  it('shows error when submitting with empty program name', () => {
    render(<AddProgramForm onAdd={async () => true} />);
    
    fireEvent.click(screen.getByText('Create Program'));
    
    expect(screen.getByText('Program name cannot be empty')).toBeInTheDocument();
  });

  it('calls onAdd with program name and description when form is submitted', async () => {
    const handleAdd = vi.fn().mockResolvedValue(true);
    render(<AddProgramForm onAdd={handleAdd} />);
    
    fireEvent.change(screen.getByLabelText('Program Name'), { 
      target: { value: 'New Program' } 
    });
    
    fireEvent.change(screen.getByLabelText('Description (Optional)'), { 
      target: { value: 'Program description' } 
    });
    
    fireEvent.click(screen.getByText('Create Program'));
    
    await waitFor(() => {
      expect(handleAdd).toHaveBeenCalledWith('New Program', 'Program description');
    });
  });

  it('calls onAdd with only program name when description is empty', async () => {
    const handleAdd = vi.fn().mockResolvedValue(true);
    render(<AddProgramForm onAdd={handleAdd} />);
    
    fireEvent.change(screen.getByLabelText('Program Name'), { 
      target: { value: 'New Program' } 
    });
    
    fireEvent.click(screen.getByText('Create Program'));
    
    await waitFor(() => {
      expect(handleAdd).toHaveBeenCalledWith('New Program', undefined);
    });
  });

  it('shows loading state during submission', async () => {
    // Create a promise that we can resolve manually
    let resolvePromise: (value: boolean) => void;
    const addPromise = new Promise<boolean>(resolve => {
      resolvePromise = resolve;
    });
    
    const handleAdd = vi.fn().mockReturnValue(addPromise);
    render(<AddProgramForm onAdd={handleAdd} />);
    
    fireEvent.change(screen.getByLabelText('Program Name'), { 
      target: { value: 'New Program' } 
    });
    
    fireEvent.click(screen.getByText('Create Program'));
    
    // Check that the button text changes to indicate loading
    expect(screen.getByText('Creating...')).toBeInTheDocument();
    
    // Resolve the promise to complete the submission
    resolvePromise!(true);
    
    await waitFor(() => {
      expect(screen.getByText('Create Program')).toBeInTheDocument();
    });
  });

  it('shows error message when add operation fails', async () => {
    const handleAdd = vi.fn().mockResolvedValue(false);
    render(<AddProgramForm onAdd={handleAdd} />);
    
    fireEvent.change(screen.getByLabelText('Program Name'), { 
      target: { value: 'New Program' } 
    });
    
    fireEvent.click(screen.getByText('Create Program'));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to create program')).toBeInTheDocument();
    });
  });

  it('clears the inputs after successful submission', async () => {
    const handleAdd = vi.fn().mockResolvedValue(true);
    render(<AddProgramForm onAdd={handleAdd} />);
    
    const nameInput = screen.getByLabelText('Program Name');
    const descriptionInput = screen.getByLabelText('Description (Optional)');
    
    fireEvent.change(nameInput, { target: { value: 'New Program' } });
    fireEvent.change(descriptionInput, { target: { value: 'Program description' } });
    
    fireEvent.click(screen.getByText('Create Program'));
    
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });
});
