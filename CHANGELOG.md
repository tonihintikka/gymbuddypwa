# Changelog

All notable changes to GymTrack PWA are documented here.

## 2026-11-25

### Added
- Optional `rir` on each logged set (0–5 picker) and optional `targetRir` on program exercises.
- The 5-day recovery program now targets RIR 2–3. Existing saved copies gain the missing targets without a full overwrite.
- A next-session suggestion from the last logged RIR: hold and ease off at 0–1, keep the weight at 2, add 2.5 kg at 3 or more.
- Wiki page `wiki/rir-tracking.md`.

## 2026-11-24

### Added
- **Multi-day program support** (`Program.days[]`). Starting a program with days shows a day picker and only loads that day's exercises.
- **5-Day Recovery-Friendly (40+)** built-in program with Upper/Lower style days.
- New exercises: Hack Squat, Angled T-Bar Row, T-Bar Row (close grip), and related variants.
- **Day name in active workout header** so the user always knows which session they are in.
- Larger day cards and clearer "Start Day" button in the day picker.
- iOS PWA meta tags (`apple-mobile-web-app-capable`, status bar style, title) and safe-area insets.
- Improved offline support: `navigateFallback` for SPA routes, clearer offline indicator message.
- **Karpathy-style wiki** under `wiki/` documenting architecture, data models, storage, and workout flow.
- Tests for multi-day program day selection.

### Changed
- Built-in program seeding now migrates existing IndexedDB entries when the code version gains a `days` structure.
- Export history now uses Web Share API on iOS (with Blob fallback) instead of a data-URI download, which was unreliable in Safari/PWA.

### Fixed
- Export History button did nothing on iOS.

## 2025

### Progress Visualization
- Added progress tab with Chart.js.
- Estimated 1RM (Epley), max weight, and total volume charts.
- Exercise-specific progress series.
- Smart exercise prioritization in the progress view (`useExercisesWithHistory`): exercises with data shown first, with workout counts.

### Exercise Structure
- Muscle group and category classifications on exercises.
- 50+ built-in exercises covering major muscle groups.
- Grouping by base movement (e.g. all bench press variations).
- Advanced filtering in both the exercise screen and the add-exercise dialog.

### UI / UX
- Card-based redesign of exercise selection.
- Color-coded metadata badges, improved typography and spacing.
- Accessibility improvements (ARIA labels, contrast, touch targets).

### Workout Flow
- Empty workout can be saved as a new program.
- Workout state lifted so it survives tab switches.
- Editable workout history (weight and reps of past sets).

### Data
- Export workout history as JSON (initially data-URI based).

### Quality
- Test suite stabilized (Vitest + Testing Library).
- Feature branching and documentation practices established.

## 2025-04

### Initial Release
- Core PWA: React 19, TypeScript, Vite, IndexedDB.
- Workout logging, programs, exercises, history.
- Offline support via service worker.
- Deployed to Vercel.

Initial development was done in roughly 5.5 hours across two days using multiple AI models for specification, rules, and implementation.
