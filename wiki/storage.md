# Storage

## IndexedDB

Defined in `src/services/db.ts`.

- Database name: `gymtrack-db`
- Version: 1
- Object stores: `exercises`, `programs`, `workoutLogs`, `settings`
- Key path: `id` on all stores

The service exposes a singleton connection (`getDatabase`) and CRUD helpers (`saveItem`, `getAllItems`, `getItemById`, `deleteItem`).

## React Hook

`useIndexedDB<T>(storeName)` wraps the service:

- Loads all items on mount
- Exposes `items`, `loading`, `error`
- `saveItem` / `deleteItem` reload the list after mutation
- `getItem` is a direct lookup

## Built-in Program Seeding

`usePrograms` contains a static `builtInPrograms` array.

On mount (after loading finishes):

1. Missing built-in programs are written to IndexedDB.
2. If the code version has `days` but the saved version does not, the program is overwritten (migration).
3. Custom programs (non-matching IDs) are left alone.
4. Built-in programs cannot be deleted via the UI.

This is how the 5-day program and day structure reached existing users.

## What Is Not Stored

- Active workout state (React only, until finish).
- UI preferences beyond last tab (localStorage).
- Any user account or cloud sync.
