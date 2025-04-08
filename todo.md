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
- [ ] Add ability to edit workout programs
- [ ] Add ability to duplicate workout programs
- [ ] Add ability to share workout programs

## Bug Reports
- [ ] Exercise search doesn't filter properly
- [ ] Workout history doesn't show all completed workouts 