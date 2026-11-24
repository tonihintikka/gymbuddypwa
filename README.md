# GymTrack PWA

A progressive web application for tracking weightlifting workouts. Designed for fast, simple interactions during active training sessions.

**Documentation:** [Wiki](wiki/index.md) · [Changelog](CHANGELOG.md)

## About

GymTrack is a mobile-first PWA that works entirely offline. All data is stored locally in IndexedDB. No account is required.

Live demo: [https://gymbuddypwa.vercel.app](https://gymbuddypwa.vercel.app)

## Features

- **Workout logging** — large controls, set modifiers (failure, pause, slow eccentric), exercise navigation
- **Programs** — built-in templates (including multi-day programs) and custom programs
- **Multi-day support** — programs can define days; the start screen shows a day picker
- **Exercise catalog** — 50+ built-in exercises with muscle group and category filtering, plus custom exercises
- **History** — view, edit, and export past workouts
- **Progress** — charts for estimated 1RM, volume, and max weight
- **Offline-first** — full functionality without network after install

## Technology

- React 19 + TypeScript
- Vite + `vite-plugin-pwa` (Workbox)
- IndexedDB
- Chart.js
- Vitest

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Install as PWA

Use the browser's "Install" or "Add to Home Screen" option. Once installed, the app opens in standalone mode and works offline.

## Data

Everything stays on the device. Clearing browser data removes workouts and programs.

## Project Structure

For architecture, data models, workout flow, and storage details, see the **[wiki](wiki/index.md)**.

Key locations:

- `src/features/` — feature modules (exercise, program, workout, history, progress)
- `src/services/db.ts` — IndexedDB
- `src/types/models.ts` — domain types

## Changelog

Recent changes are listed in [CHANGELOG.md](CHANGELOG.md).

## License

MIT
