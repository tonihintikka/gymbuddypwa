# GymTrack wiki

The code in `src/` is the source. This directory is the compiled map of that code. Read this catalog, then open one page.

How the wiki stays current: [AGENTS.md](../AGENTS.md). What changed, and when: [log](log.md).

## Architecture

- [Architecture](architecture.md) — tab shell, feature folders, where state lives.
- [Data models](data-models.md) — `Exercise`, `Program`, `WorkoutLog`, and `SetLog` in `src/types/models.ts`.
- [Storage](storage.md) — IndexedDB stores, the React hook, and built-in program seeding.

## Features

Mirrors `src/features/`.

- [Exercises](exercise.md) — built-in catalog plus custom exercises, and how they are filtered.
- [Programs](program.md) — templates, multi-day programs, and the 5-day recovery program.
- [Workout flow](workout-flow.md) — start a session, log sets, finish, and write the log.
- [RIR tracking](rir-tracking.md) — reps in reserve on a set, target RIR, and the next-session load hint.
- [History](history.md) — past workouts, edits, and JSON export.
- [Progress](progress.md) — charts computed from workout logs. Nothing is stored separately.

## PWA

- [PWA and offline](pwa.md) — service worker, install metadata, and what works with no network.
- [Safari and WebKit](safari-webkit.md) — button box model, the fixed tab bar, and how an installed PWA picks up new CSS.

## Bugs and decisions

- [Bottom nav not fixed](bugs/bottom-nav-not-fixed.md) — iOS drops `position: fixed` when the page is wider than the screen. The RIR column did that.
