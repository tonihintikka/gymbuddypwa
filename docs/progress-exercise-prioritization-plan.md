# Feature Plan: Progress Exercise Prioritization

## Overview
Improve the Progress tab user experience by prioritizing exercises with workout data at the top of the exercise selector, making it more usable for users to find exercises they can actually view progress for.

## User Experience Goals
- **Faster workflow**: Users find their exercises immediately
- **Better discovery**: Clear which exercises have progress data  
- **Focused experience**: Most relevant content first
- **Still complete**: All exercises remain available

## Implementation Tasks

### 1. Data Layer
- [ ] **Create useExercisesWithHistory hook** - Logic to identify exercises with workout data
  - Query workout logs to find which exercises have been used
  - Return exercises grouped by "with data" vs "without data"
  - Include workout count for each exercise

### 2. UI Components
- [ ] **Modify ExerciseSelector component** - Separate exercises with data vs all exercises
  - Group exercises into two sections
  - Handle the grouped data structure
  - Maintain current functionality

### 3. Visual Improvements
- [ ] **Add section headers** - 'Exercises with Data' and 'All Exercises' in dropdown
  - Clear visual separation between sections
  - Descriptive section labels

- [ ] **Show workout count** - Display count next to names (e.g. 'Bench Press (12 workouts)')
  - Show number of workouts for exercises with data
  - Help users understand which exercises have the most data

- [ ] **Add visual separators** - Between sections in the exercise dropdown
  - Visual dividers or styling to separate sections
  - Improved readability

### 4. Integration
- [ ] **Update ProgressScreen integration** - Pass exercise history data to ExerciseSelector
  - Integrate new hook with existing ProgressScreen
  - Pass grouped exercise data to selector component

### 5. Testing & Quality
- [ ] **Test improved UX** - Verify with sample workout data
  - Test with various data scenarios
  - Ensure sorting and grouping works correctly

- [ ] **Ensure accessibility** - Exercises without data remain accessible but deprioritized
  - All exercises still selectable
  - Proper accessibility attributes
  - No functionality lost

## Technical Approach

### Data Structure
```typescript
interface ExerciseWithHistory {
  exercise: Exercise;
  workoutCount: number;
  hasData: boolean;
}

interface GroupedExercises {
  withData: ExerciseWithHistory[];
  withoutData: ExerciseWithHistory[];
}
```

### Implementation Flow
1. Create hook to analyze workout logs and group exercises
2. Update ExerciseSelector to handle grouped data
3. Add visual enhancements for better UX
4. Integrate with existing ProgressScreen
5. Test and refine

## Success Criteria
- Users see exercises with data first
- Workout counts are displayed accurately  
- All exercises remain accessible
- No regression in existing functionality
- Improved user satisfaction with Progress tab