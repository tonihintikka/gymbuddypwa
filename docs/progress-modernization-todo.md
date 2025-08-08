# Progress Tab Modernization - To-Do Checklist

Goal: Make the Progress tab a modern, mobile-first dashboard that surfaces key insights quickly, with smooth charts and minimal taps.

Guidelines
- Mobile-first, offline-first, performance-focused, type-safe
- Use existing Chart.js setup; add downsampling and caching
- Safe-area aware; 44px tap targets

## Milestone A - Header and filters

### [x] A1 Time range picker
- File: `src/features/progress/components/TimeRangePicker.tsx` (new)
- Presets: 7D, 30D, 90D, 1Y, All; emits `range: { days?: number }`

### [x] A2 Exercise picker bottom sheet
- File: `src/features/progress/components/ExercisePicker.tsx` (new)
- Reuse grouped exercises; search + group toggle; confirm selection

## Milestone B - KPI cards

### [x] B1 KPI card component with sparkline
- File: `src/features/progress/components/KpiCard.tsx` (new)
- Props: `title`, `value`, `deltaPct`, `trend`, `sparkData`
- Compact, tappable; opens the corresponding chart

### [x] B2 KPI grid
- File: `src/features/progress/components/KpiGrid.tsx` (new)
- 2×2 grid: Estimated 1RM, Max weight, Total volume, Total reps

## Milestone C - Charts

### [x] C1 Swipeable chart carousel
- File: `src/features/progress/components/ChartCarousel.tsx` (new)
- Charts: 1RM (line), Volume (area), Reps/session (bar)

### [x] C2 Downsampling and pre-aggregation
- File: `src/features/progress/hooks/useProgressData.ts` (new)
- Daily buckets in IndexedDB; downsample to ~60 points; compute deltas and PRs

## Milestone D - PR highlights

### [ ] D1 PR list
- File: `src/features/progress/components/PrList.tsx` (new)
- Shows New 1RM, Max volume, Max reps; tap to open history session

## Milestone E - Screen composition

### [x] E1 Implement screen
- File: `src/features/progress/components/ProgressScreen.tsx`
- Assemble header (title + TimeRangePicker + ExercisePicker), KPI grid, carousel, PR list
- Skeleton loaders during data fetch

## Milestone F - Styling and a11y

### [x] F1 CSS
- File: `src/features/progress/components/Progress.css` (new)
- Sticky header, safe-area padding, card elevations, pagination dots

### [ ] F2 Accessibility
- `aria-live` summaries for KPI deltas; charts have descriptive `aria-label`

## Milestone G - Tests

### [ ] G1 Data hook tests
- File: `src/features/progress/hooks/__tests__/useProgressData.test.ts`
- Validates bucketing, downsampling, deltas, and PR detection

### [ ] G2 Screen behavior tests
- File: `src/features/progress/components/__tests__/ProgressModern.test.tsx`
- Range changes, exercise selection, KPI tap to chart, carousel paging

## Done criteria
- Fast, modern Progress screen with KPI + charts; smooth on mobile; all tests green