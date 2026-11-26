# Storage

## IndexedDB

Defined in [src/services/db.ts](../src/services/db.ts).

- Database name: `gymtrack-db`
- Version: 1
- Object stores: `exercises`, `programs`, `workoutLogs`, `settings`
- Key path: `id` on all stores

The service exposes a singleton connection (`getDatabase`) and CRUD helpers (`saveItem`, `getAllItems`, `getItemById`, `deleteItem`).

## React Hook

[useIndexedDB](../src/hooks/useIndexedDB.ts) wraps the service:

- Loads all items on mount
- Exposes `items`, `loading`, `error`
- `saveItem` / `deleteItem` reload the list after mutation
- `getItem` is a direct lookup

## Built-in Program Seeding

[usePrograms](../src/features/program/hooks/usePrograms.ts) contains a static `builtInPrograms` array. See [programs](program.md).

On mount (after loading finishes):

1. Missing built-in programs are written to IndexedDB.
2. If the code version has `days` but the saved version does not, the program is overwritten (migration).
3. If a saved built-in is missing `targetRir` where the code definition has one, [mergeMissingTargetRir](../src/features/program/mergeProgramTargets.ts) copies that number onto the matching exercise and leaves user-added exercises alone. See [RIR tracking](rir-tracking.md).
4. Custom programs (non-matching IDs) are left alone.
5. Built-in programs cannot be deleted via the UI.

`rir` on a set and `targetRir` on a template are optional fields on the existing objects. Database version stays 1. Old records load without those keys.

This is how the 5-day program and day structure reached existing users.

## What Is Not Stored

- Active workout state (React only, until finish).
- UI preferences beyond last tab (localStorage).
- Any user account or cloud sync.
