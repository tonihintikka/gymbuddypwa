# Changelog

All notable changes to GymTrack PWA are documented here.

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

## Earlier

See `README.md` for the original development history and feature set as of mid-2025. The long-form development process notes remain there for reference.
