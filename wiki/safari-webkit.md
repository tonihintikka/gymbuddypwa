# Safari and WebKit

iPhone rules that desktop Chromium does not show. Verified with Playwright WebKit, iPhone 13, 390×844, against `vite preview` of the production build (service worker controlling the page).

## Buttons

Source: [index.css](../src/index.css), [SetInputForm](../src/features/workout/components/SetInputForm.tsx), [Workout.css](../src/features/workout/components/Workout.css).

`button { all: unset }` resets `box-sizing` to `content-box` and leaves the WebKit button appearance in play. A later `button { box-sizing: border-box }` in [App.css](../src/App.css) has the same specificity. It wins only when that file is concatenated after `index.css`. WebKit also gives a `<button>` an intrinsic minimum width and, with the default `-webkit-appearance: button`, does not treat `width: 100%` plus horizontal padding the way Chromium does. The padding is painted outside the 100%, so Log Set starts in line with the inputs and runs past the grey form, the white card, and to the screen edge.

The reset is one declaration block. Longhands after `all: unset` in that block are what WebKit keeps:

- `box-sizing: border-box`
- `-webkit-appearance: none` and `appearance: none`
- `min-width: 0` and `max-width: 100%`

Log Set does not use `width: 100%`. `.set-input-form` is a column flex container. The button is `align-self: stretch` with horizontal padding `0`, so a content-box button still ends on the form's content edge, the same left and right inset as the Weight and Reps fields. Add Exercise under the card uses the same stretch.

## Bottom nav

The document does not scroll. [`.app-nav`](../src/App.css) is `position: fixed; bottom: 0; left: 0; right: 0`. Do not use `width: 100vw` (it is wider than the layout viewport once `viewport-fit=cover` is set). Do not let a table or a button widen the page. Detail: [bottom nav not fixed](bugs/bottom-nav-not-fixed.md).

In the WebKit check the nav's bottom edge matched `window.innerHeight` after `.app-content` was scrolled, and `documentElement.scrollWidth` stayed equal to the viewport.

## Service worker

[vite.config.ts](../vite.config.ts) sets `registerType: 'autoUpdate'`, `skipWaiting` (generated into `sw.js`), `clientsClaim`, and `cleanupOutdatedCaches: true`.

The old injected `registerSW.js` only called `navigator.serviceWorker.register`. The new worker activated and claimed the page, but the open document kept the CSS it was parsed with. An installed iOS PWA often stays in memory, so the Log Set fix never appeared until a full reload.

Registration is now [main.tsx](../src/main.tsx) via `virtual:pwa-register` (`injectRegister: null`, so the tiny script is not also injected). In auto-update mode that helper reloads the page when the new worker's `activated` event is an update. It also calls `registration.update()` on load, when the app becomes visible, and hourly, because iOS standalone does not check for a new worker on its own.

[src/pwa.ts](../src/pwa.ts) still defines a register function. Nothing imports it. The update banner in [PWAUpdateNotification](../src/components/PWAUpdateNotification.tsx) listens for `controllerchange` only when a controller was already active, so the first install does not claim a new version is ready. It offers a manual reload if the automatic one has not run yet.
