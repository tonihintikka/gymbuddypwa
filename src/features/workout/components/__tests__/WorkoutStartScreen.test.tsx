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

  const multiDayProgram: Program = {
    id: '3',
    name: '5-Day Split',
    exercises: [],
    days: [
      { id: 'd1', name: 'Upper A', exercises: [{ exerciseId: 'ex1' }, { exerciseId: 'ex2' }] },
      { id: 'd2', name: 'Lower A', description: 'Squat focus', exercises: [{ exerciseId: 'ex3' }] },
    ],
  };

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

  it('shows day selection for multi-day programs', () => {
    render(
      <WorkoutStartScreen
        programs={[multiDayProgram]}
        onStartProgram={() => {}}
        onStartEmpty={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Select Day'));

    expect(screen.getByText('Upper A')).toBeInTheDocument();
    expect(screen.getByText('Lower A')).toBeInTheDocument();
    expect(screen.getByText('Squat focus')).toBeInTheDocument();
    expect(screen.getByText('2 exercises')).toBeInTheDocument();
    expect(screen.getByText('1 exercise')).toBeInTheDocument();
    expect(screen.getAllByText('Start Day').length).toBe(2);
  });

  it('starts the selected day from multi-day program', () => {
    const handleStartProgram = vi.fn();
    render(
      <WorkoutStartScreen
        programs={[multiDayProgram]}
        onStartProgram={handleStartProgram}
        onStartEmpty={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Select Day'));
    const startDayButtons = screen.getAllByText('Start Day');
    fireEvent.click(startDayButtons[1]); // Lower A

    expect(handleStartProgram).toHaveBeenCalledWith('3', 'd2');
  });

  it('can go back from day selection', () => {
    render(
      <WorkoutStartScreen
        programs={[multiDayProgram]}
        onStartProgram={() => {}}
        onStartEmpty={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Select Day'));
    expect(screen.getByText('Upper A')).toBeInTheDocument();

    fireEvent.click(screen.getByText('← Back'));
    expect(screen.getByText('5-Day Split')).toBeInTheDocument();
    expect(screen.queryByText('Upper A')).not.toBeInTheDocument();
  });
});
