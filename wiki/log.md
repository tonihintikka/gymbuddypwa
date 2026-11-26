# Wiki log

Append-only. Newest last. One heading per change so `grep "^## \[" wiki/log.md | tail -5` shows the latest entries.

`src/` is the source. Entries here record when the compiled pages were updated from that code.

## [2026-11-24] ingest | initial wiki compiled from the source

Architecture, data models, storage, workout flow, feature-module notes, and PWA. Written from the code, not from the planning docs under `docs/`.

## [2026-11-25] ingest | RIR tracking and set recommendations

`SetLog.rir` and `ProgramExercise.targetRir` shipped. Page: [rir-tracking.md](rir-tracking.md). The 5-day program seeds RIR 2–3.

## [2026-11-26] fix | bottom nav regression

The RIR column widened the logged-sets table and iOS Safari un-fixed the tab bar. Page: [bugs/bottom-nav-not-fixed.md](bugs/bottom-nav-not-fixed.md).

## [2026-11-26] lint | catalog aligned to src/features

Replaced double-bracket links with relative Markdown links. Split the feature notes into pages that match `src/features/`. Added this log and the conventions in [AGENTS.md](../AGENTS.md).

## [2026-11-26] fix | Log Set button wider than the form

`button { all: unset }` in [index.css](../src/index.css) beat `* { box-sizing: border-box }`, so `.log-set-btn` at `width: 100%` added its padding outside the grey form and the card. Buttons are border-box again. See [workout flow](workout-flow.md).
