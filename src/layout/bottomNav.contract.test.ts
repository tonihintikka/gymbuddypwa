import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const appCss = readFileSync(resolve(process.cwd(), 'src/App.css'), 'utf8');
const workoutCss = readFileSync(resolve(process.cwd(), 'src/features/workout/components/Workout.css'), 'utf8');
const appCssWithoutComments = appCss.replace(/\/\*[\s\S]*?\*\//g, '');

function block(css: string, selector: string): string {
  const start = css.indexOf(selector);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  return css.slice(open, close);
}

describe('bottom nav layout contract', () => {
  it('pins the nav to the viewport and pads it for the home indicator', () => {
    const nav = block(appCss, '.app-nav {');
    expect(nav).toContain('position: fixed');
    expect(nav).toContain('bottom: 0');
    expect(nav).toContain('left: 0');
    expect(nav).toContain('right: 0');
    expect(nav).toContain('padding-bottom: env(safe-area-inset-bottom)');
    expect(nav).not.toContain('100vw');
  });

  it('does not use 100vw, which overflows the layout viewport on iOS', () => {
    expect(appCssWithoutComments).not.toContain('100vw');
  });

  it('scrolls the main column, not the document, and clears the nav', () => {
    const shell = block(appCss, '.app-container {');
    expect(shell).toContain('overflow: hidden');
    expect(shell).toContain('100dvh');

    const content = block(appCss, '.app-content {');
    expect(content).toContain('overflow-y: auto');
    expect(content).toContain('padding-bottom: calc(56px + env(safe-area-inset-bottom)');
    expect(content).toContain('min-width: 0');
  });

  it('lets the logged-sets table scroll inside itself', () => {
    const scroller = block(workoutCss, '.sets-table-scroll {');
    expect(scroller).toContain('overflow-x: auto');
    expect(scroller).toContain('max-width: 100%');
    const table = block(workoutCss, '.sets-table {');
    expect(table).toContain('min-width: 100%');
    const cells = block(workoutCss, '.sets-table th,');
    expect(cells).toContain('white-space: nowrap');
  });
});
