# GymTrack PWA Wiki

> English, code-derived, Karpathy-style. Written from the actual source, not aspirations.

This is a dense, hierarchical map of how the application is structured and how data flows. Prefer reading these pages over grepping when you need to understand a subsystem.

## Start Here

- [[architecture]] — overall shape, feature modules, key boundaries
- [[data-models]] — TypeScript interfaces that define the domain
- [[storage]] — IndexedDB, object stores, migration of built-in programs
- [[workout-flow]] — how a workout is started, logged, and finished
- [[pwa]] — service worker, offline, iOS specifics
- [[rir-tracking]] — RIR on sets, target RIR on programs, next-session load hint

## Feature Modules

Each lives under `src/features/<name>/` and follows the same pattern: `hooks/`, `components/`, `index.ts` barrel.

| Module | Responsibility | Key Hook |
|--------|----------------|----------|
| exercise | Exercise catalog + filtering | `useExercises` |
| program | Program templates (built-in + custom) | `usePrograms` |
| workout | Active workout session | `useWorkout` |
| history | Past workouts, edit, export | `useHistory` |
| progress | Charts and KPIs | `useProgressData`, `useExerciseProgress` |

## Cross-Cutting

- `src/services/db.ts` — IndexedDB singleton + CRUD
- `src/hooks/useIndexedDB.ts` — React hook over the service
- `src/types/models.ts` — shared domain types
- `src/components/` — PWA chrome (offline indicator, install prompt, update notification)

## Quick Mental Model

1. Everything important is local. No backend.
2. Programs and exercises are templates. Workouts are instances (`WorkoutLog`).
3. Multi-day programs use `Program.days[]`. Starting a workout from a day copies that day's exercises into the log.
4. Built-in programs are seeded/migrated from code into IndexedDB on load.
5. The active workout lives in React state until `finishWorkout` writes it to IndexedDB.

## Related Docs (outside wiki)

- `docs/apple-compliance-and-ux-plan.md` — iOS UX and guideline notes
- `README.md` — project overview and development history
