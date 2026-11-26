# Agent notes

## Wiki

`src/`, the tests, and the config are the raw source. `wiki/` is the compiled knowledge layer. Pages describe the code that exists now. They do not restate plans under `docs/` that the code does not implement.

When a change in `src/` alters behavior, structure, or a decision:

1. Update the wiki page for that area. Link the source files with a relative path from the page, for example `[useWorkout](../src/features/workout/hooks/useWorkout.ts)`.
2. If the page is new, add it to `wiki/index.md` under the group that matches the code (`src/features/…`, storage, PWA, or bugs). One relative Markdown link and one line. Do not list raw files, scratch notes, or `docs/` dumps.
3. Append a heading to `wiki/log.md`: `## [YYYY-MM-DD] ingest|fix|lint | short title`.

Cross-links between pages are relative Markdown links (`[RIR](rir-tracking.md)`). Double-bracket links do not render on GitHub.

`wiki/index.md` is the catalog. Read it before grepping the tree for how a feature works. `wiki/log.md` is the timeline, not a topic page.
