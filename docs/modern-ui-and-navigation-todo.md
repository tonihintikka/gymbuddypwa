# 2025 Visual Refresh + Navigation Simplification — To‑Do

Goal: Make the app feel modern (2025) while staying fast and thumb‑friendly. Reduce bottom tabs by merging History and Progress into one Insights tab with in‑screen sub‑tabs.

Principles
- Mobile‑first, offline‑first, performance‑focused, type‑safe
- Small, incremental edits; keep all tests green after each milestone
- Respect safe‑areas and a11y (>=44px targets, visible focus, high contrast)

## Milestone 1 — Theme Tokens + Dark Mode (low risk)

### [ ] T1.1 Introduce CSS tokens (light/dark)
- Files: `src/App.css` or `src/index.css`
- Add `:root` variables and `prefers-color-scheme: dark` overrides
- Tokens: radii (8/12/16), spacing (4/8/12/16/24), colors (brand, surface, on-surface, muted, border), elevations (shadows)

Acceptance: cards/buttons/inputs use tokens; dark mode works automatically

### [ ] T1.2 Apply tokens to primitives
- Files: `src/components/*`, `src/features/**/components/*.css`
- Update buttons, cards, inputs, chips, tabs to use variables; soften borders; increase radius

Acceptance: visuals match token spec; no layout regressions

## Milestone 2 — App Bar, Buttons, Tabs (quick wins)

### [ ] T2.1 App Bar polish
- Files: `src/App.css`, `src/App.tsx`
- Subtle gradient, matching `<meta name="theme-color">`, rounded Finish button

### [ ] T2.2 Buttons
- Primary: radius 14px, hover/active states, micro press scale (honor reduced-motion)

### [ ] T2.3 Bottom tab bar
- Taller bar, active tab with rounded capsule backdrop, >=44px targets, 24px icons

Acceptance: app bar/tabs feel modern; hit areas large; safe areas respected

## Milestone 3 — Exercise Cards + Chips

### [ ] T3.1 Exercise card restyle
- File: `src/features/exercise/components/Exercise.css`
- 12–16px radius, soft 1px border, low elevation; bigger name; single-row badges; trailing options icon placeholder

### [ ] T3.2 Chip badges
- Pills with soft background, strong contrast; uppercase optional

Acceptance: cards look lighter; metadata readable; matches tokens

## Milestone 4 — Workout Primary Actions

### [ ] T4.1 Sticky Log Set bar
- Files: `src/features/workout/components/ActiveWorkoutScreen.tsx`, `src/features/workout/components/Workout.css`
- Full-width sticky pill at bottom; shadow; safe‑area padding; Undo snackbar (5s)

### [ ] T4.2 Motion micro‑feedback
- CSS transitions 120–200ms; press scale 0.98; success checkmark fade; honor reduced‑motion

Acceptance: Log action always thumb‑reachable; feedback clear and subtle

## Milestone 5 — Compact Filters (use separate plan)
- See `docs/compact-filter-todo.md`
- Implement compact toolbar (Search + Group + Filters), bottom sheet, chips

Acceptance: header height reduced on mobile; same pattern in Add‑to‑Workout dialog

## Milestone 6 — Navigation Simplification (merge History + Progress)

### [ ] N6.1 Create Insights screen with sub‑tabs
- New: `src/features/insights/components/InsightsScreen.tsx`
- Contains segmented control (History | Progress) or tabs; lazy mount; reuse `HistoryScreen` and `ProgressScreen`

### [ ] N6.2 Update routes + bottom nav
- File: `src/App.tsx`
- Bottom nav: `Workout`, `Exercises`, `Programs`, `Insights`
- Routes: `/insights?tab=history|progress`
- Redirects: `/history` -> `/insights?tab=history`, `/progress` -> `/insights?tab=progress`

### [ ] N6.3 Persist sub‑tab
- Remember last selected tab in `sessionStorage`

Acceptance: combined Insights tab; deep links work; state persists; no regressions

### [ ] N6.4 Tests
- Files: `src/features/insights/components/__tests__/InsightsScreen.test.tsx`, update any nav tests
- Cases: default tab, switch tabs, redirects, persistence

## Milestone 7 — Accessibility & Safe Areas

### [ ] A7.1 Safe‑area padding
- Use `env(safe-area-inset-*)` for sticky footer/app bar

### [ ] A7.2 A11y audit
- Targets >=44px; visible focus; aria-pressed on toggles; contrast >= 4.5:1 for text

## Milestone 8 — QA & Rollout

### [ ] Q8.1 Device pass
- iOS Safari + Android Chrome: theme swap, safe areas, sticky bar, performance, reduced‑motion

### [ ] Q8.2 Docs & changelog
- Update `README.md` visuals, add screenshots; summarize nav change and theming

Notes
- Keep bundle lean; no heavy UI libs
- Prefer CSS for motion; memoize heavy components
- Gate risky changes behind flags if needed
