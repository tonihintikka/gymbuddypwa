import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SetInputForm } from '../SetInputForm';
import '../../../../index.css';
import '../../../../App.css';
import '../Workout.css';

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

  it('keeps Log Set inside the form box (border-box, not wider than the inputs)', () => {
    const { container } = render(<SetInputForm onLogSet={vi.fn()} />);
    const form = container.querySelector('.set-input-form') as HTMLElement;
    const button = screen.getByRole('button', { name: 'Log Set' }) as HTMLButtonElement;
    const weight = screen.getByLabelText('Weight') as HTMLInputElement;

    expect(getComputedStyle(button).boxSizing).toBe('border-box');
    expect(button.classList.contains('log-set-btn')).toBe(true);
    expect(form.contains(button)).toBe(true);
    expect(form.contains(weight)).toBe(true);

    const workoutCss = readFileSync(resolve(process.cwd(), 'src/features/workout/components/Workout.css'), 'utf8');
    const rule = workoutCss.slice(workoutCss.indexOf('.log-set-btn {'), workoutCss.indexOf('}', workoutCss.indexOf('.log-set-btn {')));
    expect(rule).toContain('box-sizing: border-box');
    expect(rule).toContain('max-width: 100%');
    expect(rule).toContain('width: 100%');
  });
});
