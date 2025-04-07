import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryList } from '../HistoryList';
import { WorkoutLog } from '../../../../types/models';

describe('HistoryList', () => {
  const mockWorkoutLogs: WorkoutLog[] = [
    { 
      id: '1', 
      date: new Date('2023-01-01T10:00:00'), 
      loggedExercises: [
        { 
          exerciseId: 'ex1', 
          sets: [
            { weight: 100, reps: 10 },
            { weight: 110, reps: 8 }
          ] 
        },
        { 
          exerciseId: 'ex2', 
          sets: [
            { weight: 50, reps: 12 }
          ] 
        }
      ]
    },
    { 
      id: '2', 
      date: new Date('2023-01-02T15:30:00'), 
      loggedExercises: [
        { 
          exerciseId: 'ex3', 
          sets: [
            { weight: 80, reps: 10 }
          ] 
        }
      ],
      programId: 'program1'
    }
  ];

  it('renders the history list correctly', () => {
    render(
      <HistoryList
        workoutLogs={mockWorkoutLogs}
        onSelectWorkout={() => {}}
      />
    );
    
    expect(screen.getByText('Workout History')).toBeInTheDocument();
    expect(screen.getByText('Filter by date:')).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    render(
      <HistoryList
        workoutLogs={[]}
        onSelectWorkout={() => {}}
        loading={true}
      />
    );
    
    expect(screen.getByText('Loading workout history...')).toBeInTheDocument();
  });

  it('shows empty state message when no workouts are available', () => {
    render(
      <HistoryList
        workoutLogs={[]}
        onSelectWorkout={() => {}}
      />
    );
    
    expect(screen.getByText('No workout history available. Complete your first workout!')).toBeInTheDocument();
  });

  it('displays the list of workouts with correct information', () => {
    render(
      <HistoryList
        workoutLogs={mockWorkoutLogs}
        onSelectWorkout={() => {}}
      />
    );
    
    // Check dates are displayed
    expect(screen.getByText('Sunday, January 1, 2023')).toBeInTheDocument();
    expect(screen.getByText('Monday, January 2, 2023')).toBeInTheDocument();
    
    // Check exercise counts
    expect(screen.getByText('2 exercises')).toBeInTheDocument();
    expect(screen.getByText('1 exercise')).toBeInTheDocument();
    
    // Check set counts
    expect(screen.getByText('3 sets')).toBeInTheDocument();
    expect(screen.getByText('1 sets')).toBeInTheDocument();
    
    // Check program ID is displayed
    expect(screen.getByText('Program:')).toBeInTheDocument();
    expect(screen.getByText('program1')).toBeInTheDocument();
  });

  it('filters workouts based on date input', () => {
    render(
      <HistoryList
        workoutLogs={mockWorkoutLogs}
        onSelectWorkout={() => {}}
      />
    );
    
    const dateInput = screen.getByLabelText('Filter by date:');
    fireEvent.change(dateInput, { target: { value: '2023-01-01' } });
    
    // Only the first workout should be visible
    expect(screen.getByText('Sunday, January 1, 2023')).toBeInTheDocument();
    expect(screen.queryByText('Monday, January 2, 2023')).not.toBeInTheDocument();
    
    // Clear filter button should be visible
    expect(screen.getByText('Clear')).toBeInTheDocument();
    
    // Click clear button
    fireEvent.click(screen.getByText('Clear'));
    
    // Both workouts should be visible again
    expect(screen.getByText('Sunday, January 1, 2023')).toBeInTheDocument();
    expect(screen.getByText('Monday, January 2, 2023')).toBeInTheDocument();
  });

  it('calls onSelectWorkout when a workout is clicked', () => {
    const handleSelectWorkout = vi.fn();
    render(
      <HistoryList
        workoutLogs={mockWorkoutLogs}
        onSelectWorkout={handleSelectWorkout}
      />
    );
    
    // Click the first workout
    fireEvent.click(screen.getByText('Sunday, January 1, 2023').closest('li')!);
    
    expect(handleSelectWorkout).toHaveBeenCalledWith('1');
  });

  it('calls onDeleteWorkout when delete button is clicked', () => {
    const handleDeleteWorkout = vi.fn();
    // Mock window.confirm to always return true
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);
    
    render(
      <HistoryList
        workoutLogs={mockWorkoutLogs}
        onSelectWorkout={() => {}}
        onDeleteWorkout={handleDeleteWorkout}
      />
    );
    
    // Delete buttons should be visible
    const deleteButtons = screen.getAllByText('Delete');
    expect(deleteButtons.length).toBe(2);
    
    // Click the first delete button
    fireEvent.click(deleteButtons[0]);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(handleDeleteWorkout).toHaveBeenCalledWith('1');
    
    // Restore original window.confirm
    window.confirm = originalConfirm;
  });
});
