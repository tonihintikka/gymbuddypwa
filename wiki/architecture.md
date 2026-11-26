# Architecture

How the app is split. The shell is [App.tsx](../src/App.tsx) and [App.css](../src/App.css).

## Stack

- React 19 + TypeScript
- Vite + `vite-plugin-pwa` (Workbox)
- IndexedDB for all persistent data
- Material-ish custom CSS (no component library dependency in core)
- Vitest + Testing Library

## Directory Shape

```
src/
  App.tsx                 # tab shell + providers
  components/             # PWA chrome
  features/
    exercise/
    program/
    workout/
    history/
    progress/
  hooks/useIndexedDB.ts
  services/db.ts
  types/models.ts
```

## Feature Module Pattern

Every feature follows:

```
features/<name>/
  hooks/          # data + business logic
  components/     # screens and UI pieces
  index.ts        # public exports
```

Screens are thin. Logic lives in hooks. Components receive data and callbacks.

## State Boundaries

| Concern | Where it lives |
|---------|----------------|
| Active workout | React state in `useWorkout` (lifted via context) |
| Programs, exercises, history | IndexedDB via `useIndexedDB` |
| UI tab | localStorage + URL hash |
| Built-in program definitions | Static array in `usePrograms.ts`, seeded to IDB |

## Navigation

[App.tsx](../src/App.tsx) owns the bottom tab bar. The active tab is stored in `localStorage` and mirrored to the hash. There is no router.

The document does not scroll. [`.app-content`](../src/App.css) is the scroller, and `.app-nav` is `position: fixed`. A page wider than the phone makes iOS Safari un-fix that bar. See [bottom nav](bugs/bottom-nav-not-fixed.md) and [PWA](pwa.md).

## Workout Context

[WorkoutProvider](../src/features/workout/context/WorkoutContext.tsx) wraps the app so the active workout survives tab switches. `useWorkoutContext` exposes the same interface as [useWorkout](../src/features/workout/hooks/useWorkout.ts). The flow is [workout flow](workout-flow.md).

## Key Invariants

- A `WorkoutLog` is only written to IndexedDB when the user finishes the workout.
- Built-in programs cannot be deleted (checked by ID in `deleteProgram`).
- Multi-day programs keep a flat `exercises` array for backward compatibility (often empty when `days` is present).
- Exercise IDs are stable strings (e.g. `'hack-squat'`, `'angled-t-bar-row'`). Custom exercises get UUIDs.
