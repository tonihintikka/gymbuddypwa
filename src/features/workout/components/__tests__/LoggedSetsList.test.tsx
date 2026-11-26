import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoggedSetsList } from '../LoggedSetsList';

describe('LoggedSetsList', () => {
  it('keeps the sets table inside its own horizontal scroller', () => {
    const { container } = render(
      <LoggedSetsList
        sets={[
          { weight: 48.5, reps: 10, rir: 2 },
          { weight: 27.5, reps: 15, rir: 3 },
        ]}
        onDeleteSet={() => undefined}
      />,
    );

    const scroller = container.querySelector('.sets-table-scroll');
    const table = container.querySelector('.sets-table');
    expect(scroller).not.toBeNull();
    expect(scroller?.contains(table ?? null)).toBe(true);
    expect(screen.getByRole('columnheader', { name: 'RIR' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
  });
});
