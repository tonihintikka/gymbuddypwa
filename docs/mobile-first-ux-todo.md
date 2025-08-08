# Mobile-First UX Improvements – Implementation To‑Do

Purpose: Make workout logging fast, thumb-friendly, and reliable on mobile. Tasks are prioritized, scoped, and include acceptance criteria plus file pointers so an agent can work independently.

Notes
- Keep core principles: mobile-first, offline-first, performance-focused, type-safe.
- Prefer small, incremental edits with passing tests after each step.
- Avoid new dependencies unless specified; keep bundle small.

## Milestone 1 — Faster Set Logging (Highest impact)

### [ ] M1.1 Numeric keypad + input hints
Goal: Show the correct mobile keyboard and speed up IME flow.
- Add `inputMode="decimal"` to Weight, `inputMode="numeric"` to Reps.
- Add `enterKeyHint="done"` on both inputs.
- Auto-focus Weight when navigating between exercises.

Acceptance
- On iOS/Android, Weight opens decimal keypad; Reps opens numeric.
- When moving to another exercise, Weight is focused.

Files
- `src/features/workout/components/SetInputForm.tsx`
- `src/features/workout/components/ActiveWorkoutScreen.tsx`
- `src/features/workout/components/Workout.css`

---

### [ ] M1.2 Autofill previous set values
Goal: One‑tap logging by prefilling with last set for the same exercise.
- Prefill Weight and Reps with the most recent logged set for the current exercise.
- If no history exists for this exercise in the current workout, leave empty.

Acceptance
- After selecting an exercise (or after logging a set), fields show last values.
- Manual edits are preserved until the next log or exercise change.

Files
- `src/features/workout/hooks/useWorkout.ts` (helper to get last set for exercise)
- `src/features/workout/components/SetInputForm.tsx`

---

### [ ] M1.3 Quick steppers for Weight/Reps
Goal: Reduce typing; make adjustments with thumb.
- Add small ± buttons next to Weight (±0.5, ±1, ±2.5 kg) and Reps (±1).
- Support press-and-hold to repeat every 120ms (accelerate to 60ms after 1s).

Acceptance
- Buttons adjust values correctly; long-press repeats smoothly.
- Values clamp at 0; decimals supported for Weight.

Files
- `src/features/workout/components/SetInputForm.tsx`
- `src/features/workout/components/Workout.css`

---

### [ ] M1.4 Sticky Log Set bar with Undo
Goal: Keep primary action in thumb zone; allow quick revert.
- Make `Log Set` a sticky footer within the content safe area.
- After logging, show an inline snackbar/toast with “Undo” (5s timeout).
- Undo removes the last set for the current exercise only.

Acceptance
- Log Set is always visible at bottom; respects iOS/Android safe areas.
- Undo reverts the most recent set and restores input values.

Files
- `src/features/workout/components/ActiveWorkoutScreen.tsx`
- `src/features/workout/components/Workout.css`
- `src/features/workout/hooks/useWorkout.ts` (expose `undoLastSet(exerciseId)`)

## Milestone 2 — Tappable Toggles & Navigation

### [ ] M2.1 Replace checkboxes with chip toggles
Goal: Larger, clearer toggles for Failure / Paused / Slow Eccentric.
- Use accessible buttons with `aria-pressed` and 44px min tap size.
- Visual states: default, selected, disabled.

Acceptance
- Tapping toggles state; keyboard and screen readers announce state.

Files
- `src/features/workout/components/SetInputForm.tsx`
- `src/features/workout/components/Workout.css`

---

### [ ] M2.2 Swipe to navigate exercises
Goal: Faster navigation without reaching for buttons.
- Implement lightweight touch gesture: swipe left = Next, swipe right = Previous.
- Keep buttons for discoverability; move them near bottom (above tab bar).

Acceptance
- Swiping triggers navigation with a subtle transition.
- Buttons remain and are reachable with thumb.

Files
- `src/features/workout/components/ActiveWorkoutScreen.tsx`
- `src/features/workout/components/Workout.css`

## Milestone 3 — Feedback & Rest Timing

### [ ] M3.1 Haptic + visual confirmation on log
Goal: Clear feedback that a set was saved.
- Trigger light vibration (Vibration API) and a brief checkmark animation on the exercise title.

Acceptance
- On supported devices, vibration fires; visual feedback appears and fades.

Files
- `src/features/workout/components/ActiveWorkoutScreen.tsx`
- `src/features/workout/components/Workout.css`

---

### [ ] M3.2 Inline rest timer after logging
Goal: Encourage consistent rest without leaving the screen.
- Auto-start a 90s timer after each log (configurable constant).
- Show a compact pill with time remaining and a +15s button; vibrate at 0.
- Cancel/restart timer on next log.

Acceptance
- Timer appears after logging and counts down; +15s extends time.
- Replaced on next log; vibration at end (if supported).

Files
- `src/features/workout/components/ActiveWorkoutScreen.tsx`
- `src/features/workout/components/Workout.css`
- `src/hooks` add `useRestTimer.ts` (new)

## Milestone 4 — Power & Performance

### [ ] M4.1 Screen Wake Lock during active workout
Goal: Prevent screen from sleeping while logging sets.
- Add `useWakeLock` hook that requests wake lock when a workout is active, releases when paused/finished or on tab blur.
- Graceful fallback for browsers without support.

Acceptance
- Screen stays on during active workout on supported devices; never throws.

Files
- `src/hooks/useWakeLock.ts` (new)
- Integrate in `src/features/workout/components/ActiveWorkoutScreen.tsx`

---

### [ ] M4.2 Memoize heavy components
Goal: Reduce re-renders on low-end devices.
- Wrap `LoggedSetsList`, `SetInputForm`, and `ExerciseView` with `memo` where props are stable.
- Use `useCallback`/`useMemo` for event handlers and derived values.

Acceptance
- No behavioral change; React DevTools shows reduced renders while typing/logging.

Files
- `src/features/workout/components/LoggedSetsList.tsx`
- `src/features/workout/components/SetInputForm.tsx`
- `src/features/workout/components/ExerciseView.tsx`

## Milestone 5 — PWA polish & accessibility

### [ ] M5.1 Safe-area & theme-color
Goal: Visual polish matching OS chrome.
- Add CSS `env(safe-area-inset-*)` paddings for sticky footer and top app bar.
- Ensure `<meta name="theme-color">` matches app bar; verify manifest backgrounds.

Acceptance
- No clipped content near notches/home indicator; status bar color matches app.

Files
- `index.html`
- `public/manifest.json`
- `src/App.css` / `src/features/workout/components/Workout.css`

---

### [ ] M5.2 A11y & tap target audit
Goal: Meet WCAG touch target guidance.
- Ensure all primary controls meet ≥44x44px; labels bound via `htmlFor`.
- Verify color contrast on badges/buttons in light/dark contexts.

Acceptance
- Automated checks pass; manual audit on small device viewport.

Files
- `src/features/workout/components/*`
- `src/features/exercise/components/*`

## Testing & QA

### [ ] T1 Unit tests for new behaviors
- Autofill and steppers logic (increment/decrement, long-press repeat).
- Undo behavior restores last set and input values.
- Rest timer start/extend/cancel flows.

Files
- `src/features/workout/components/__tests__/ActiveWorkoutScreen.test.tsx` (new)
- `src/features/workout/components/__tests__/SetInputForm.test.tsx` (new)

### [ ] T2 Manual device checklist (add to docs)
- iOS Safari, Android Chrome: correct keyboards; sticky footer; swipe nav; wake lock; vibration; safe areas.

## Rollout plan
1) Ship Milestone 1 behind a small feature flag if needed.
2) Verify no regressions in tests; run on actual devices.
3) Proceed sequentially through milestones; keep commits scoped per task.


