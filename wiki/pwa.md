# PWA and Offline

## Configuration

[vite.config.ts](../vite.config.ts) uses `vite-plugin-pwa` with Workbox. The manifest and service worker are generated at build time. [main.tsx](../src/main.tsx) registers the worker with `virtual:pwa-register` and reloads when an update activates. The plugin no longer injects `registerSW.js`, which registered the worker and left the open page on the old CSS. [src/pwa.ts](../src/pwa.ts) also defines `registerServiceWorker`, but nothing imports that module.

Important settings:

- `registerType: 'autoUpdate'` (new worker calls `skipWaiting` and `clientsClaim`; the client reloads on an update)
- `navigateFallback: '/index.html'` (SPA routes work offline)
- `cleanupOutdatedCaches: true` (the previous precache is deleted once the new worker activates)
- `registration.update()` on load, on `visibilitychange`, and hourly (iOS standalone does not check by itself)
- Runtime caching for Google Fonts and images

Safari button and nav rules: [safari-webkit.md](safari-webkit.md).

## iOS Specifics

[index.html](../index.html) includes:

- `apple-mobile-web-app-capable`
- `apple-mobile-web-app-status-bar-style`
- `apple-mobile-web-app-title`
- `viewport-fit=cover`

CSS uses `env(safe-area-inset-*)` on the header, the bottom nav, and the offline banner.

The bottom nav is `position: fixed` and the document itself does not scroll. A table wider than the phone (the RIR column did this) makes iOS Safari un-fix that bar. See [bottom nav not fixed](bugs/bottom-nav-not-fixed.md). Layout rules are in [App.css](../src/App.css).

## Offline Indicator

[OfflineIndicator](../src/components/OfflineIndicator.tsx) listens to `online` / `offline` events and shows a banner when offline. The message notes that data is local.

## Export on iOS

`exportWorkoutLogs` in [useHistory](../src/features/history/hooks/useHistory.ts):

1. Prefers `navigator.share` with a `File` (works in installed iOS PWAs).
2. Falls back to `URL.createObjectURL` + hidden `<a download>`.

The old data-URI approach was unreliable on iOS.

## What Works Offline

Once the app is installed and the service worker has cached the shell:

- Starting and finishing workouts
- Viewing history and programs
- Progress charts (computed from local data)

No network calls are required for core functionality.
