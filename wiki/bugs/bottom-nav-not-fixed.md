# Bottom nav scrolls away on iOS

Symptom, cause, and the rule that keeps it fixed. The bug is old. It was fixed once, then the RIR column brought it back.

## Symptom

On an installed iPhone PWA (portrait, ~390pt, standalone), the bottom bar (Workout / Exercises / Programs / History / Progress) does not stay at the bottom of the screen.

Scroll the active workout and the bar rides up with the page. It ends up floating over the set form or the logged-sets table. Content continues below it. The page can also shift sideways: a vertical seam appears, and the Actions column is clipped (`Actio`, `Del`).

## Earlier fix

`900a941` ("Fix header and navigation layout consistency across views"), April 2025.

Before that commit the nav was `position: sticky`, and at `min-width: 768px` it became `position: static`. The commit changed it to:

- `position: fixed; bottom: 0; left: 0; right: 0` on `.app-nav`
- the same for `.app-header`
- `overflow-x: hidden` on `body` and `.app-container`
- `width: 100vw` on the header

`628885b` later added `env(safe-area-inset-bottom)` to the nav height and padding. That part was still correct.

`overflow-x: hidden` only hides the sideways scrollbar. On iOS it does not stop `position: fixed` from breaking once something is actually wider than the layout viewport.

## What the RIR change did

`96f180a` added an RIR column and an Actions column to `.sets-table` (`LoggedSetsList`). Cell padding stayed `0.75rem`. On a 390pt phone the workout card is about 320px wide after page and card padding. Six columns at that padding are wider than the card.

The table's min-content width then widened, in order:

1. `.logged-sets-list`
2. `.exercise-view`
3. `.active-workout-screen`, a flex item of `.app-content` (`min-width: auto`, so it will not shrink)
4. the document

iOS Safari treats a document that can scroll horizontally as a reason to un-fix `position: fixed`. The nav stays where it was first painted and scrolls with the page. That is the floating bar in the recording. The sideways shift is the same overflow.

`width: 100vw` on the header makes this easier to hit. `100vw` includes the scrollbar gutter and is often a few pixels wider than the layout viewport, which is enough to trigger the bug on its own.

## Fix

The document does not scroll. Only `.app-content` does.

| Rule | Where |
|------|--------|
| `html`, `body`, `#root` are `height: 100%`, `max-height: 100dvh`, `overflow: hidden` | `src/App.css` |
| `.app-container` is `height: 100dvh` and `overflow: hidden` | `src/App.css` |
| `.app-nav` is `position: fixed; bottom: 0; left: 0; right: 0`, height and `padding-bottom` use `env(safe-area-inset-bottom)` | `src/App.css` |
| `.app-content` is the scroller (`overflow-y: auto`, `min-width: 0`) and its `padding-bottom` is `56px + env(safe-area-inset-bottom)` so the last row clears the bar | `src/App.css` |
| Header width is `auto` with `left`/`right: 0`. No `100vw`. | `src/App.css` |
| `.sets-table` sits in `.sets-table-scroll` (`overflow-x: auto; max-width: 100%`). Cells are `nowrap`. The table is `min-width: 100%` and grows only inside that scroller | `Workout.css`, `History.css`, `LoggedSetsList`, `WorkoutDetailView` |

Direct children of `.app-content` get `min-width: 0` so a wide table cannot stretch the flex column.

## Do not regress

- Do not set `width: 100vw` on the header, the nav, or the shell.
- Do not put `transform`, `filter`, `perspective`, or `will-change` on `.app-container`, `#root`, or `body`. Any of those becomes the containing block for `position: fixed`.
- Do not let a table, a nowrap row, or a wide button set the page width. Wrap it in a `max-width: 100%; overflow-x: auto` element, and give flex parents `min-width: 0`.
- Do not move `.app-nav` inside `.app-content`. The nav is a sibling of the scroller.
- If you add a column to `.sets-table`, check a 390px-wide workout with two logged sets: the nav stays on the bottom edge after scrolling, and `document.documentElement.scrollWidth` is not greater than the viewport.

The contract is asserted in `src/layout/bottomNav.contract.test.ts`. The table wrapper is asserted in `LoggedSetsList.test.tsx`.
