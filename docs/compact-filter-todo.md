# Compact Mobile Filtering - To-Do Checklist

Goal: Minimize vertical space used by filters on mobile while keeping fast discovery. On mobile, show only Search and Group toggle by default; expose Muscle Group and Category in a bottom sheet. Apply the same pattern to the Add Exercise to Workout dialog.

Guidelines
- Mobile-first, offline-first, performance-focused, type-safe
- Keep desktop/tablet behavior intact (inline filters visible at >= 768px)
- Reuse logic between Exercises view and Add-to-Workout dialog

## Milestone A - Shared filter state

### [ ] A1 Create reusable hook useExerciseFilters
- Location: `src/features/exercise/hooks/useExerciseFilters.ts`
- State: `search: string`, `muscleGroup: MuscleGroup | 'All'`, `category: ExerciseCategory | 'All'`, `groupByBase: boolean`
- API: `setSearch`, `setMuscleGroup`, `setCategory`, `toggleGroup`, `reset`, `hasActiveFilters` (muscle/category not All), `activeChips` (array of { key, label, onRemove })
- Optional: persist last used filters in localStorage per view key

Acceptance
- Hook can be unit tested standalone; state updates are predictable and pure

## Milestone B - Compact header + chips (Exercises view)

### [ ] B1 Compact toolbar for mobile
- File: `src/features/exercise/components/ExerciseList.tsx`
- Replace top filter block on mobile (<= 768px) with:
  - Search input (full width)
  - Two small icon buttons on the right: Group (aria-pressed) and Filters (opens bottom sheet)
- Keep current inline selects visible on desktop (>= 768px) using CSS media queries

Acceptance
- On mobile, only search + two buttons are visible in the header

### [ ] B2 Active filter chips
- File: `src/features/exercise/components/FilterChips.tsx` (new)
- Props: `chips: { key: string; label: string; onRemove: () => void }[]`, `onClearAll?: () => void`
- Render a horizontally scrollable chip row under the search (wrap on desktop)

Acceptance
- When Muscle Group/Category are set, chips appear; tapping a chip removes that filter; Clear All removes both

## Milestone C - Bottom sheet filters (Exercises view)

### [ ] C1 Bottom sheet component
- File: `src/features/exercise/components/FiltersBottomSheet.tsx` (new)
- Props: `open`, `onClose`, `onApply`, `values: { muscleGroup, category }`, `onChange`
- Behavior: focus trap, ESC/overlay closes, returns focus to Filters button, safe-area aware
- Content: two selects (Muscle Group, Category), actions: Apply (primary), Clear (secondary), Close (icon or link)

Acceptance
- Opening/closing works with keyboard and touch; Apply updates list; Clear resets filters

### [ ] C2 Wire up to ExerciseList.tsx
- Use `useExerciseFilters` for state; pass derived `filteredExercises` and `grouped` to existing rendering

Acceptance
- Filtering behavior unchanged; UI is compact on mobile

## Milestone D - Apply to Add Exercise to Workout dialog

### [ ] D1 Mirror compact toolbar & chips in dialog
- File: `src/features/workout/components/AddExerciseToWorkoutDialog.tsx`
- Reuse `useExerciseFilters`, `FilterChips`, and `FiltersBottomSheet`
- Make search row sticky inside the dialog for long lists

Acceptance
- Same compact experience as Exercises view; consistent visuals and behavior

## Milestone E - Styling

### [ ] E1 CSS additions
- Files: `src/features/exercise/components/Exercise.css` (extend), optional dialog-specific overrides in `src/features/workout/components/Workout.css`
- Classes: `.filters-toolbar`, `.filters-actions`, `.filter-chips`, `.bottom-sheet`, `.bottom-sheet__header`, `.bottom-sheet__content`, `.bottom-sheet__actions`
- Mobile: reduce padding; ensure 44px min tap targets; support horizontal chip scroll; safe-area insets

Acceptance
- Header height reduced to one search row (+ optional chip row). No overlap with tab bar or app bar

## Milestone F - Tests

### [ ] F1 Hook tests
- File: `src/features/exercise/hooks/__tests__/useExerciseFilters.test.ts`
- Cases: set/search/category/group toggle; `hasActiveFilters`; chips removal and `reset`

### [ ] F2 Component tests (Exercises view)
- File: `src/features/exercise/components/__tests__/ExerciseCompactFilters.test.tsx` (new)
- Cases: open/close bottom sheet, apply/clear filters, chip removal, group toggle aria state

### [ ] F3 Component tests (Add-to-Workout dialog)
- File: `src/features/workout/components/__tests__/AddExerciseDialogCompactFilters.test.tsx` (new)
- Cases mirroring F2 inside the dialog environment

## Milestone G - Desktop parity & a11y

### [ ] G1 Desktop retains inline selects
- Ensure breakpoint >= 768px shows inline selects; bottom sheet optional but stays in sync

### [ ] G2 Accessibility
- Buttons have aria-label; group toggle uses aria-pressed; focus is managed when opening/closing sheet; selects have labels

## Out of scope / later
- Searchable selects; filter count badge on Filters button; persisted filters per route (consider later)

## Done criteria
- Mobile header compact (search + group + filters). Chips show active filters. Bottom sheet filters work in both views. All tests pass; no regressions
