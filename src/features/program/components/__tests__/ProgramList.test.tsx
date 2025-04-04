import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgramList } from '../ProgramList';
import { Program } from '../../../../types/models';

describe('ProgramList', () => {
  const mockPrograms: Program[] = [
    { 
      id: '1', 
      name: 'Strength Program', 
      exercises: [
        { exerciseId: 'ex1' },
        { exerciseId: 'ex2' }
      ] 
    },
    { 
      id: '2', 
      name: 'Hypertrophy Program', 
      description: 'For muscle growth',
      exercises: [
        { exerciseId: 'ex3' }
      ] 
    },
    { 
      id: '3', 
      name: 'Empty Program', 
      exercises: [] 
    },
  ];

  it('renders the list of programs', () => {
    render(<ProgramList programs={mockPrograms} />);
    
    expect(screen.getByText('Strength Program')).toBeInTheDocument();
    expect(screen.getByText('Hypertrophy Program')).toBeInTheDocument();
    expect(screen.getByText('Empty Program')).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    render(<ProgramList programs={[]} loading={true} />);
    
    expect(screen.getByText('Loading programs...')).toBeInTheDocument();
  });

  it('shows empty state message when no programs are available', () => {
    render(<ProgramList programs={[]} />);
    
    expect(screen.getByText('No programs available. Create your first workout program!')).toBeInTheDocument();
  });

  it('displays the correct exercise count for each program', () => {
    render(<ProgramList programs={mockPrograms} />);
    
    expect(screen.getByText('2 exercises')).toBeInTheDocument();
    expect(screen.getByText('1 exercise')).toBeInTheDocument();
    expect(screen.getByText('0 exercises')).toBeInTheDocument();
  });

  it('filters programs based on search input', () => {
    render(<ProgramList programs={mockPrograms} />);
    
    const searchInput = screen.getByPlaceholderText('Search programs...');
    fireEvent.change(searchInput, { target: { value: 'hyper' } });
    
    expect(screen.getByText('Hypertrophy Program')).toBeInTheDocument();
    expect(screen.queryByText('Strength Program')).not.toBeInTheDocument();
    expect(screen.queryByText('Empty Program')).not.toBeInTheDocument();
  });

  it('calls onSelectProgram when a program is clicked', () => {
    const handleSelect = vi.fn();
    render(<ProgramList programs={mockPrograms} onSelectProgram={handleSelect} />);
    
    fireEvent.click(screen.getByText('Strength Program'));
    
    expect(handleSelect).toHaveBeenCalledWith(mockPrograms[0]);
  });

  it('calls onAddProgram when Create Program button is clicked', () => {
    const handleAdd = vi.fn();
    render(<ProgramList programs={mockPrograms} onAddProgram={handleAdd} />);
    
    fireEvent.click(screen.getByText('Create Program'));
    
    expect(handleAdd).toHaveBeenCalled();
  });

  it('calls onDeleteProgram when delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(<ProgramList programs={mockPrograms} onDeleteProgram={handleDelete} />);
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(handleDelete).toHaveBeenCalledWith('1'); // ID of the first program
  });
});
