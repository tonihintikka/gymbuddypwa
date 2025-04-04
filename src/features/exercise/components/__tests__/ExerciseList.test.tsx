import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseList } from '../ExerciseList';
import { Exercise } from '../../../../types/models';

describe('ExerciseList', () => {
  const mockExercises: Exercise[] = [
    { id: '1', name: 'Squat', isCustom: false },
    { id: '2', name: 'Bench Press', isCustom: false },
    { id: '3', name: 'Custom Exercise', isCustom: true },
  ];

  it('renders the list of exercises', () => {
    render(<ExerciseList exercises={mockExercises} />);
    
    expect(screen.getByText('Squat')).toBeInTheDocument();
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Custom Exercise')).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    render(<ExerciseList exercises={[]} loading={true} />);
    
    expect(screen.getByText('Loading exercises...')).toBeInTheDocument();
  });

  it('shows empty state message when no exercises are available', () => {
    render(<ExerciseList exercises={[]} />);
    
    expect(screen.getByText('No exercises available. Add your first exercise!')).toBeInTheDocument();
  });

  it('filters exercises based on search input', () => {
    render(<ExerciseList exercises={mockExercises} />);
    
    const searchInput = screen.getByPlaceholderText('Search exercises...');
    fireEvent.change(searchInput, { target: { value: 'bench' } });
    
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.queryByText('Squat')).not.toBeInTheDocument();
    expect(screen.queryByText('Custom Exercise')).not.toBeInTheDocument();
  });

  it('calls onSelectExercise when an exercise is clicked', () => {
    const handleSelect = vi.fn();
    render(<ExerciseList exercises={mockExercises} onSelectExercise={handleSelect} />);
    
    fireEvent.click(screen.getByText('Squat'));
    
    expect(handleSelect).toHaveBeenCalledWith(mockExercises[0]);
  });

  it('calls onAddExercise when Add Exercise button is clicked', () => {
    const handleAdd = vi.fn();
    render(<ExerciseList exercises={mockExercises} onAddExercise={handleAdd} />);
    
    fireEvent.click(screen.getByText('Add Exercise'));
    
    expect(handleAdd).toHaveBeenCalled();
  });

  it('shows delete button only for custom exercises', () => {
    render(<ExerciseList exercises={mockExercises} onDeleteExercise={() => {}} />);
    
    const deleteButtons = screen.getAllByText('Delete');
    expect(deleteButtons).toHaveLength(1);
    
    // The delete button should be next to the custom exercise
    const customExerciseItem = screen.getByText('Custom Exercise').closest('li');
    expect(customExerciseItem).toContainElement(deleteButtons[0]);
  });

  it('calls onDeleteExercise when delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(<ExerciseList exercises={mockExercises} onDeleteExercise={handleDelete} />);
    
    fireEvent.click(screen.getByText('Delete'));
    
    expect(handleDelete).toHaveBeenCalledWith('3'); // ID of the custom exercise
  });
});
