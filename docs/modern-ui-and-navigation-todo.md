# Modern UI and Navigation - To-Do Checklist

Goal: Refresh the app's look-and-feel and navigation for a clean, native-like PWA experience while preserving offline-first performance. Keep interactions fast and mobile-first.

Guidelines
- Mobile-first, offline-first, performance-focused, type-safe
- Keep DOM/CSS simple; avoid heavy UI kits
- Reuse tokens in `src/App.css` (CSS variables) and existing component CSS

## Milestone A - App shell polish

### [x] A1 Header cleanup
- File: `src/App.css`, `src/App.tsx`
- Reduce header height to 48–56px on mobile
- Left: app icon + name, Right: minimal actions (e.g., settings/overflow)
- Ensure sticky, elevate with subtle shadow, safe-area padding

### [x] A2 Content container spacing
- Files: `src/App.css`
- Harmonize paddings/margins (`.app-content`, `.feature-container`)
- Ensure no double spacing around feature screens

## Milestone B - Bottom navigation improvements

### [x] B1 Iconized tabs
- File: `src/App.tsx`, assets under `public/icons/`
- Add simple SVG icons for `Workout`, `Exercises`, `Programs`, `History`, `Progress`
- Render label under icon; active state uses `--primary-color`

### [x] B2 Improve tap targets and feedback
- File: `src/App.css`
- Minimum 44x44 touch area; add pressed state and focus ring
- Use subtle background highlight for active and hover

### [x] B3 Persist last tab
- File: `src/App.tsx`
- Persist `activeTab` to `localStorage`; restore on load

## Milestone C - Route-ready architecture (optional)

### [ ] C1 Introduce simple router boundary
- Files: `src/App.tsx`
- Abstract current tab rendering behind a `CurrentRoute` component
- Prepare for `react-router` migration without adding dependency now

### [ ] C2 URL hash sync (optional)
- Sync `activeTab` into `location.hash` (e.g., `#workout`) to allow deep links

## Milestone D - Theming and tokens

### [ ] D1 Token audit
- File: `src/App.css`
- Confirm variables: `--text-color`, `--text-secondary`, `--background-color`, `--card-color`, etc.
- Add `--surface-elev`, `--radius`, `--shadow` presets for consistent elevation and rounding

### [ ] D2 Light/Dark readiness (later)
- Provide a future-friendly hook to flip tokens based on system theme
- Do not change runtime yet; keep light mode default

## Milestone E - Reusable UI elements

### [x] E1 IconButton
- File: `src/components/IconButton.tsx` (new) and `src/App.css`
- Props: `ariaLabel`, `icon`, `active?`, `onClick`
- Used in header actions and compact filter toolbar

### [ ] E2 SectionHeader
- File: `src/components/SectionHeader.tsx` (new)
- Props: `title`, `actions?`
- Replace scattered `<h2>` + buttons patterns

## Milestone F - Performance and a11y

### [ ] F1 Reduce layout shifts
- Audit image/icon sizes; set width/height attributes
- Prefer CSS `content-visibility: auto` for long lists

### [ ] F2 Keyboard & screen reader
- Ensure landmarks: header, main, nav have proper roles
- Use `aria-current="page"` on active nav button

## Milestone G - Tests

### [ ] G1 Navigation persistence test
- File: `src/__tests__/navigation.test.tsx` (new)
- Ensures last tab persists across reloads

### [ ] G2 Accessibility checks
- File: `src/__tests__/a11y.test.tsx` (new)
- Verify `aria-current`, focus management, and roles

## Done criteria
- Header and bottom nav feel native on mobile with icons and strong tap targets
- Last visited tab persists
- No regressions; all tests green