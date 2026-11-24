# Apple HIG Compliance & UX Improvement Plan

**Date:** 2026-11-24  
**Status:** Research complete, implementation pending  
**Related:** Multi-day program day selection feature

## Background

GymTrack is a Progressive Web App (PWA), not a native iOS app. It does not go through App Store review directly. However, Apple Human Interface Guidelines (HIG) and relevant App Store Review Guidelines (especially 4.2 Minimum Functionality and 5.1 Privacy) serve as good quality standards for making the experience feel native and reliable on iPhone.

### Current State Assessment

| Area | Current State | Apple Perspective | Risk / Notes |
|------|---------------|-------------------|--------------|
| **Day selection** | Works (user picks day before starting workout) | HIG Workouts: clear session selection, no distraction during workout | Low – logic is solid |
| **Workout start** | Select day → workout starts with only that day’s exercises | Good. HIG recommends large, easily tappable controls | OK |
| **Offline + local data** | Full IndexedDB, no backend | Strong 4.2 argument ("not just a website") | Very good |
| **Privacy** | No accounts, no cloud, data stays on device | 5.1.1 – privacy policy still recommended | Low, but missing |
| **UI / feel** | Functional, but web-styled | HIG: large buttons, safe areas, minimal distraction during workout | Medium |
| **App Store path** | Not planned | 4.2 – wrapper apps are easily rejected | High if App Store is desired later |

**Summary:** The day selection logic itself aligns well with Apple guidelines (clear session choice, no mixed exercise list). The main improvement area is making the experience more "app-like" and optimized for active workout use on iOS.

## Prioritized Improvement Plan

### 1. Day Selection UX (Quick, High Impact)

**Goal:** Make day selection clearer and more native-feeling.

- Display days as larger, more prominent cards (name + short description + exercise count).
- Add a large, clearly labeled "Start Day" button (HIG: large tappable controls).
- Show the selected day name in the active workout header (e.g. "Day 2 – Lower A") so the user always knows which session they are in.

**Files to touch:**
- `src/features/workout/components/WorkoutStartScreen.tsx`

### 2. During-Workout Experience (HIG Workouts)

**Goal:** Minimize distraction and make controls easy to use while training.

- Hide or minimize navigation during an active workout.
- Make Previous / Next buttons larger and easier to hit.
- Keep target sets/reps clearly visible (already partially done).
- Review "Finish Workout" button size and placement.

**Files to touch:**
- `src/features/workout/components/ActiveWorkoutScreen.tsx`
- Related workout components

### 3. iOS PWA Native Feel

**Goal:** Make the installed PWA feel more like a native app.

- Ensure proper `apple-mobile-web-app-capable` meta tag and correctly sized `apple-touch-icon`s.
- Use `env(safe-area-inset-*)` for header and bottom navigation (Dynamic Island / notch).
- Test thoroughly in standalone mode (Add to Home Screen → Open as Web App).

**Files to touch:**
- `index.html`
- Layout / header / bottom nav components
- CSS safe-area styles

### 4. Privacy & Compliance

**Goal:** Align with 5.1.1 expectations even for a local-only app.

- Add a simple privacy policy page (data is fully local / IndexedDB).
- Link to it from Settings or an About view.

**Files to touch:**
- New privacy page/component
- Navigation / settings

### 5. Longer-Term (App Store Consideration)

PWAs cannot be submitted directly to the App Store. A WKWebView wrapper would face Guideline 4.2 scrutiny and would need meaningful native additions (e.g. HealthKit integration, Live Activities, Shortcuts) to avoid being seen as a "repackaged website."

**Recommendation:** Keep the PWA as the primary distribution channel. Consider App Store only if clear native value is added later.

## HealthKit Integration Research (Related)

**Question:** Can GymTrack (as a PWA) integrate with HealthKit?

**Answer:** No. HealthKit is a native iOS framework. There is no web API, and Safari / PWAs cannot access it.

| Stack | Can access HealthKit? | Notes |
|-------|-----------------------|-------|
| Browser / Safari / PWA | No | No web API exists |
| WKWebView without native bridge | No | WebView is not HKHealthStore |
| Native iOS app (or WKWebView + native bridge) | Yes | Requires HealthKit entitlement, purpose strings, App Store review |

**Key Apple rules if HealthKit is ever added (native path):**
- Guideline 5.1.3: Health data cannot be used for advertising, marketing, or data mining.
- Must not write false/inaccurate data to HealthKit.
- Must not store personal health information in iCloud.
- Privacy policy required; clear purpose strings (`NSHealthShareUsageDescription`, `NSHealthUpdateUsageDescription`).
- Disclose specific health data types collected.

**Practical implication for GymTrack:** Staying as a pure PWA is simpler and avoids HealthKit compliance overhead. If HealthKit sync is desired later, a native shell (or separate companion app) would be required.

## Next Steps

1. Implement day selection UX improvements (item 1).
2. Review and improve active workout controls (item 2).
3. Audit and fix iOS PWA meta tags and safe areas (item 3).
4. Add basic privacy policy page (item 4).

---

*This document captures the research and plan from the November 2026 discussion on aligning the multi-day program flow with Apple guidelines.*
