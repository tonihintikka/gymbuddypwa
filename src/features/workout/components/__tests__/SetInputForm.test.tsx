import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SetInputForm } from '../SetInputForm';

describe('SetInputForm RIR', () => {
  it('logs a set without RIR when the picker is left empty', () => {
    const onLogSet = vi.fn();
    render(<SetInputForm onLogSet={onLogSet} />);

    fireEvent.change(screen.getByLabelText('Weight'), { target: { value: '40' } });
    fireEvent.change(screen.getByLabelText('Reps'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('button', { name: 'Log Set' }));

    expect(onLogSet).toHaveBeenCalledWith(40, 8, false, false, false, undefined);
  });

  it('logs the selected RIR and lets a second tap clear it', () => {
    const onLogSet = vi.fn();
    render(<SetInputForm onLogSet={onLogSet} programExercise={{ exerciseId: 'squat', targetRir: 3 }} />);

    expect(screen.getByText(/target 3/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Weight'), { target: { value: '40' } });
    fireEvent.change(screen.getByLabelText('Reps'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('button', { name: 'RIR 2' }));
    expect(screen.getByRole('button', { name: 'RIR 2' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'RIR 2' }));
    expect(screen.getByRole('button', { name: 'RIR 2' })).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'RIR 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Log Set' }));

    expect(onLogSet).toHaveBeenCalledWith(40, 8, false, false, false, 2);
  });
});
