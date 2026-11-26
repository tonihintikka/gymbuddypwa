# PWA and Offline

## Configuration

`vite.config.ts` uses `vite-plugin-pwa` with Workbox.

Important settings:

- `registerType: 'autoUpdate'`
- `navigateFallback: '/index.html'` (SPA routes work offline)
- `cleanupOutdatedCaches: true`
- Runtime caching for Google Fonts and images

## iOS Specifics

`index.html` includes:

- `apple-mobile-web-app-capable`
- `apple-mobile-web-app-status-bar-style`
- `apple-mobile-web-app-title`
- `viewport-fit=cover`

CSS uses `env(safe-area-inset-*)` on the header, the bottom nav, and the offline banner.

The bottom nav is `position: fixed` and the document itself does not scroll. A table wider than the phone (the RIR column did this) makes iOS Safari un-fix that bar. See [[bugs/bottom-nav-not-fixed]].

## Offline Indicator

`OfflineIndicator` listens to `online` / `offline` events and shows a banner when offline. The message notes that data is local.

## Export on iOS

`exportWorkoutLogs` in `useHistory`:

1. Prefers `navigator.share` with a `File` (works in installed iOS PWAs).
2. Falls back to `URL.createObjectURL` + hidden `<a download>`.

The old data-URI approach was unreliable on iOS.

## What Works Offline

Once the app is installed and the service worker has cached the shell:

- Starting and finishing workouts
- Viewing history and programs
- Progress charts (computed from local data)

No network calls are required for core functionality.
