## Layout Issues
- [x] Header layout inconsistent across screens
  - Created tech note in tech-notes/layout-consistency-fix.md

## Functionality Issues
- [x] Workout screen appears empty after finishing workout
  - Fixed by storing completed workout data in a separate state variable before finishWorkout() is called
  - Added completedWorkout state to ensure workout summary can still display after the currentWorkout is reset
  - Improved state management flow between workout screens
- [x] Workout history displays program IDs instead of program names
  - Updated HistoryList component to accept programs data and display program names
  - Added styling for program name display

## Mobile Compatibility Issues
- [x] Checkboxes not working properly on Safari mobile
  - Added onTouchEnd event handlers to checkboxes for better touch interaction
  - Increased touch target sizes for checkboxes
  - Added mobile-specific media query with enhanced styles for touch devices
  - Improved general button and input styling for better mobile experience

## Feature Requests
- [ ] Add ability to edit workout programs (see docs/feature-plans.md)
- [ ] Add ability to duplicate workout programs (see docs/feature-plans.md)
- [ ] Add ability to share workout programs (see docs/feature-plans.md)
- [x] Allow saving an empty workout as a new program (see docs/feature-plans.md)
  - Created SaveWorkoutAsProgramDialog component for user input
  - Updated WorkoutScreen to track empty workouts and trigger dialog after completion
  - Implemented conversion of workout exercises to program format
  - Added common dialog styling for better UX consistency
- [ ] Add "Export All Data" button to export history, programs, and exercises (see docs/feature-plans.md)

## Bug Reports
- [ ] Exercise search doesn't filter properly
- [ ] Workout history doesn't show all completed workouts 