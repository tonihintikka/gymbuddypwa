import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkoutStartScreen } from '../WorkoutStartScreen';
import { Program } from '../../../../types/models';

describe('WorkoutStartScreen', () => {
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
  ];

  it('renders the start screen correctly', () => {
    render(
      <WorkoutStartScreen
        programs={mockPrograms}
        onStartProgram={() => {}}
        onStartEmpty={() => {}}
      />
    );
    
    expect(screen.getByText('Start Workout')).toBeInTheDocument();
    expect(screen.getByText('Start Empty Workout')).toBeInTheDocument();
    expect(screen.getByText('Or select a program:')).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    render(
      <WorkoutStartScreen
        programs={[]}
        onStartProgram={() => {}}
        onStartEmpty={() => {}}
        loading={true}
      />
    );
    
    expect(screen.getByText('Loading programs...')).toBeInTheDocument();
  });

  it('shows empty state message when no programs are available', () => {
    render(
      <WorkoutStartScreen
        programs={[]}
        onStartProgram={() => {}}
        onStartEmpty={() => {}}
      />
    );
    
    expect(screen.getByText('No programs available. Create a program first.')).toBeInTheDocument();
  });

  it('displays the list of programs', () => {
    render(
      <WorkoutStartScreen
        programs={mockPrograms}
        onStartProgram={() => {}}
        onStartEmpty={() => {}}
      />
    );
    
    expect(screen.getByText('Strength Program')).toBeInTheDocument();
    expect(screen.getByText('Hypertrophy Program')).toBeInTheDocument();
    expect(screen.getByText('2 exercises')).toBeInTheDocument();
    expect(screen.getByText('1 exercise')).toBeInTheDocument();
  });

  it('filters programs based on search input', () => {
    render(
      <WorkoutStartScreen
        programs={mockPrograms}
        onStartProgram={() => {}}
        onStartEmpty={() => {}}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search programs...');
    fireEvent.change(searchInput, { target: { value: 'hyper' } });
    
    expect(screen.getByText('Hypertrophy Program')).toBeInTheDocument();
    expect(screen.queryByText('Strength Program')).not.toBeInTheDocument();
  });

  it('calls onStartEmpty when Start Empty Workout button is clicked', () => {
    const handleStartEmpty = vi.fn();
    render(
      <WorkoutStartScreen
        programs={mockPrograms}
        onStartProgram={() => {}}
        onStartEmpty={handleStartEmpty}
      />
    );
    
    fireEvent.click(screen.getByText('Start Empty Workout'));
    
    expect(handleStartEmpty).toHaveBeenCalled();
  });

  it('calls onStartProgram when Start button is clicked', () => {
    const handleStartProgram = vi.fn();
    render(
      <WorkoutStartScreen
        programs={mockPrograms}
        onStartProgram={handleStartProgram}
        onStartEmpty={() => {}}
      />
    );
    
    const startButtons = screen.getAllByText('Start');
    fireEvent.click(startButtons[0]);
    
    expect(handleStartProgram).toHaveBeenCalledWith('1');
  });

  it('calls onStartProgram when a program item is clicked', () => {
    const handleStartProgram = vi.fn();
    render(
      <WorkoutStartScreen
        programs={mockPrograms}
        onStartProgram={handleStartProgram}
        onStartEmpty={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Strength Program'));
    
    expect(handleStartProgram).toHaveBeenCalledWith('1');
  });
});
