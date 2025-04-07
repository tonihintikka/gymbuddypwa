# GymTrack PWA Testing Instructions

This document provides comprehensive testing instructions for the GymTrack PWA application using Puppeteer. These instructions cover all major features and include steps for adding sample data and taking screenshots to verify functionality.

## Table of Contents

1. [Setup](#setup)
2. [Exercise Feature Testing](#exercise-feature-testing)
3. [Program Feature Testing](#program-feature-testing)
4. [Workout Feature Testing](#workout-feature-testing)
5. [History Feature Testing](#history-feature-testing)
6. [PWA Feature Testing](#pwa-feature-testing)
7. [Responsive Design Testing](#responsive-design-testing)

## Setup

Before running the tests, ensure the application is running locally:

```javascript
// Navigate to the application
await puppeteer_navigate_Puppeteer({ url: "http://localhost:5137/" });

// Clear browser data for a fresh start
await puppeteer_evaluate_Puppeteer({
  script: `
    // Clear localStorage
    localStorage.clear();
    // Clear sessionStorage
    sessionStorage.clear();
    // Clear IndexedDB
    indexedDB.databases().then(dbs => {
      dbs.forEach(db => {
        indexedDB.deleteDatabase(db.name);
      });
    });
    // Reload the page
    window.location.reload();
  `
});

// Take a screenshot of the initial state
await puppeteer_screenshot_Puppeteer({ name: "initial-state" });
```

## Exercise Feature Testing

### Adding Exercises

```javascript
// Navigate to Exercises tab
await puppeteer_click_Puppeteer({ selector: "button:nth-child(2)" });
await puppeteer_screenshot_Puppeteer({ name: "exercises-tab-empty" });

// Click Add Exercise button
await puppeteer_click_Puppeteer({ selector: ".add-exercise-btn" });
await puppeteer_screenshot_Puppeteer({ name: "add-exercise-dialog" });

// Enter exercise name
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Exercise name']", 
  value: "Barbell Squat" 
});

// Click Add button
await puppeteer_click_Puppeteer({ selector: ".add-btn" });
await puppeteer_screenshot_Puppeteer({ name: "exercise-added-1" });

// Add another exercise
await puppeteer_click_Puppeteer({ selector: ".add-exercise-btn" });
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Exercise name']", 
  value: "Bench Press" 
});
await puppeteer_click_Puppeteer({ selector: ".add-btn" });
await puppeteer_screenshot_Puppeteer({ name: "exercise-added-2" });

// Add a third exercise
await puppeteer_click_Puppeteer({ selector: ".add-exercise-btn" });
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Exercise name']", 
  value: "Deadlift" 
});
await puppeteer_click_Puppeteer({ selector: ".add-btn" });
await puppeteer_screenshot_Puppeteer({ name: "exercise-added-3" });
```

### Searching Exercises

```javascript
// Search for an exercise
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Search exercises...']", 
  value: "Bench" 
});
await puppeteer_screenshot_Puppeteer({ name: "exercise-search-results" });

// Clear search
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Search exercises...']", 
  value: "" 
});
await puppeteer_screenshot_Puppeteer({ name: "exercise-search-cleared" });
```

### Deleting an Exercise

```javascript
// Delete an exercise (first confirm the dialog)
await puppeteer_evaluate_Puppeteer({
  script: `
    // Mock the confirm dialog to return true
    window.confirm = function() { return true; };
  `
});

// Click delete button on the third exercise
await puppeteer_click_Puppeteer({ 
  selector: ".exercise-item:nth-child(3) .delete-exercise-btn" 
});
await puppeteer_screenshot_Puppeteer({ name: "exercise-deleted" });
```

## Program Feature Testing

### Creating a Program

```javascript
// Navigate to Programs tab
await puppeteer_click_Puppeteer({ selector: "button:nth-child(3)" });
await puppeteer_screenshot_Puppeteer({ name: "programs-tab-empty" });

// Click Create Program button
await puppeteer_click_Puppeteer({ selector: ".create-program-btn" });
await puppeteer_screenshot_Puppeteer({ name: "create-program-dialog" });

// Enter program details
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Program name']", 
  value: "Strength Training" 
});
await puppeteer_fill_Puppeteer({ 
  selector: "textarea[placeholder='Program description (optional)']", 
  value: "A basic strength training program focusing on compound movements" 
});

// Click Create button
await puppeteer_click_Puppeteer({ selector: ".create-btn" });
await puppeteer_screenshot_Puppeteer({ name: "program-created" });
```

### Adding Exercises to a Program

```javascript
// Click on the program to view details
await puppeteer_click_Puppeteer({ selector: ".program-item" });
await puppeteer_screenshot_Puppeteer({ name: "program-details-empty" });

// Click Add Exercise button
await puppeteer_click_Puppeteer({ selector: ".add-exercise-to-program-btn" });
await puppeteer_screenshot_Puppeteer({ name: "add-exercise-to-program-dialog" });

// Select the first exercise (Barbell Squat)
await puppeteer_click_Puppeteer({ selector: ".exercise-item:nth-child(1)" });
await puppeteer_screenshot_Puppeteer({ name: "exercise-to-program-dialog" });

// Set target sets and reps
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Target sets']", 
  value: "5" 
});
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Target reps']", 
  value: "5" 
});

// Add notes
await puppeteer_fill_Puppeteer({ 
  selector: "textarea[placeholder='Notes (optional)']", 
  value: "Focus on proper form and depth" 
});

// Click Add button
await puppeteer_click_Puppeteer({ selector: ".add-btn" });
await puppeteer_screenshot_Puppeteer({ name: "exercise-added-to-program-1" });

// Add another exercise to the program
await puppeteer_click_Puppeteer({ selector: ".add-exercise-to-program-btn" });
await puppeteer_click_Puppeteer({ selector: ".exercise-item:nth-child(2)" });
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Target sets']", 
  value: "3" 
});
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Target reps']", 
  value: "8" 
});
await puppeteer_click_Puppeteer({ selector: ".add-btn" });
await puppeteer_screenshot_Puppeteer({ name: "exercise-added-to-program-2" });

// Go back to programs list
await puppeteer_click_Puppeteer({ selector: ".back-button" });
await puppeteer_screenshot_Puppeteer({ name: "programs-list-with-program" });
```

### Creating Another Program

```javascript
// Create another program
await puppeteer_click_Puppeteer({ selector: ".create-program-btn" });
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Program name']", 
  value: "Hypertrophy Program" 
});
await puppeteer_fill_Puppeteer({ 
  selector: "textarea[placeholder='Program description (optional)']", 
  value: "Higher volume training for muscle growth" 
});
await puppeteer_click_Puppeteer({ selector: ".create-btn" });
await puppeteer_screenshot_Puppeteer({ name: "second-program-created" });
```

## Workout Feature Testing

### Starting an Empty Workout

```javascript
// Navigate to Workout tab
await puppeteer_click_Puppeteer({ selector: "button:nth-child(1)" });
await puppeteer_screenshot_Puppeteer({ name: "workout-tab" });

// Start an empty workout
await puppeteer_click_Puppeteer({ selector: ".start-empty-workout-btn" });
await puppeteer_screenshot_Puppeteer({ name: "empty-workout-started" });

// Add an exercise to the workout
await puppeteer_click_Puppeteer({ selector: ".add-exercise-btn" });
await puppeteer_screenshot_Puppeteer({ name: "add-exercise-to-workout-dialog" });

// Select the first exercise
await puppeteer_click_Puppeteer({ selector: ".exercise-item:nth-child(1)" });
await puppeteer_screenshot_Puppeteer({ name: "exercise-added-to-workout" });
```

### Logging Sets

```javascript
// Log a set
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Weight (kg)']", 
  value: "100" 
});
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Reps']", 
  value: "5" 
});

// Check the "Failure" modifier
await puppeteer_click_Puppeteer({ selector: "input[type='checkbox'][id='isFailure']" });
await puppeteer_screenshot_Puppeteer({ name: "set-input-filled" });

// Click Log Set button
await puppeteer_click_Puppeteer({ selector: ".log-set-btn" });
await puppeteer_screenshot_Puppeteer({ name: "set-logged-1" });

// Log another set
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Weight (kg)']", 
  value: "100" 
});
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Reps']", 
  value: "5" 
});
await puppeteer_click_Puppeteer({ selector: ".log-set-btn" });
await puppeteer_screenshot_Puppeteer({ name: "set-logged-2" });
```

### Adding Another Exercise

```javascript
// Add another exercise
await puppeteer_click_Puppeteer({ selector: ".add-exercise-btn" });
await puppeteer_click_Puppeteer({ selector: ".exercise-item:nth-child(2)" });
await puppeteer_screenshot_Puppeteer({ name: "second-exercise-added" });

// Log a set for the second exercise
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Weight (kg)']", 
  value: "80" 
});
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Reps']", 
  value: "8" 
});
await puppeteer_click_Puppeteer({ selector: ".log-set-btn" });
await puppeteer_screenshot_Puppeteer({ name: "set-logged-for-second-exercise" });
```

### Navigating Between Exercises

```javascript
// Navigate to previous exercise
await puppeteer_click_Puppeteer({ selector: ".prev-exercise-btn" });
await puppeteer_screenshot_Puppeteer({ name: "navigated-to-previous-exercise" });

// Navigate to next exercise
await puppeteer_click_Puppeteer({ selector: ".next-exercise-btn" });
await puppeteer_screenshot_Puppeteer({ name: "navigated-to-next-exercise" });
```

### Finishing a Workout

```javascript
// Finish the workout
await puppeteer_click_Puppeteer({ selector: ".finish-workout-btn" });
await puppeteer_screenshot_Puppeteer({ name: "workout-summary" });

// Close the summary
await puppeteer_click_Puppeteer({ selector: ".close-summary-btn" });
await puppeteer_screenshot_Puppeteer({ name: "back-to-workout-start" });
```

### Starting a Program Workout

```javascript
// Start a program workout
await puppeteer_click_Puppeteer({ selector: ".program-item:nth-child(1)" });
await puppeteer_screenshot_Puppeteer({ name: "program-selected" });

// Click Start button
await puppeteer_click_Puppeteer({ selector: ".start-program-btn" });
await puppeteer_screenshot_Puppeteer({ name: "program-workout-started" });

// Log a set in the program workout
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Weight (kg)']", 
  value: "120" 
});
await puppeteer_fill_Puppeteer({ 
  selector: "input[placeholder='Reps']", 
  value: "5" 
});
await puppeteer_click_Puppeteer({ selector: ".log-set-btn" });
await puppeteer_screenshot_Puppeteer({ name: "program-workout-set-logged" });

// Finish the program workout
await puppeteer_click_Puppeteer({ selector: ".finish-workout-btn" });
await puppeteer_screenshot_Puppeteer({ name: "program-workout-summary" });

// Close the summary
await puppeteer_click_Puppeteer({ selector: ".close-summary-btn" });
await puppeteer_screenshot_Puppeteer({ name: "back-to-workout-start-2" });
```

## History Feature Testing

### Viewing Workout History

```javascript
// Navigate to History tab
await puppeteer_click_Puppeteer({ selector: "button:nth-child(4)" });
await puppeteer_screenshot_Puppeteer({ name: "history-tab-with-workouts" });

// Click on a workout to view details
await puppeteer_click_Puppeteer({ selector: ".workout-item:nth-child(1)" });
await puppeteer_screenshot_Puppeteer({ name: "workout-details" });

// Go back to history list
await puppeteer_click_Puppeteer({ selector: ".back-button" });
await puppeteer_screenshot_Puppeteer({ name: "back-to-history-list" });
```

### Filtering Workout History

```javascript
// Filter by date
// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

await puppeteer_fill_Puppeteer({ 
  selector: "input[type='date']", 
  value: today 
});
await puppeteer_screenshot_Puppeteer({ name: "history-filtered-by-date" });

// Clear the filter
await puppeteer_click_Puppeteer({ selector: ".clear-filter-btn" });
await puppeteer_screenshot_Puppeteer({ name: "history-filter-cleared" });
```

### Deleting a Workout

```javascript
// Delete a workout (first confirm the dialog)
await puppeteer_evaluate_Puppeteer({
  script: `
    // Mock the confirm dialog to return true
    window.confirm = function() { return true; };
  `
});

// Click delete button on the second workout
await puppeteer_click_Puppeteer({ 
  selector: ".workout-item:nth-child(2) .delete-workout-btn" 
});
await puppeteer_screenshot_Puppeteer({ name: "workout-deleted" });
```

## PWA Feature Testing

### Testing Offline Mode

```javascript
// Simulate offline mode
await puppeteer_evaluate_Puppeteer({
  script: `
    // Set the browser to offline mode
    window.dispatchEvent(new Event('offline'));
  `
});
await puppeteer_screenshot_Puppeteer({ name: "offline-mode" });

// Return to online mode
await puppeteer_evaluate_Puppeteer({
  script: `
    // Set the browser back to online mode
    window.dispatchEvent(new Event('online'));
  `
});
await puppeteer_screenshot_Puppeteer({ name: "online-mode" });
```

### Testing Installation Prompt

```javascript
// Simulate the beforeinstallprompt event
await puppeteer_evaluate_Puppeteer({
  script: `
    // Create a custom event that mimics beforeinstallprompt
    const event = new Event('beforeinstallprompt');
    
    // Add the required methods
    event.prompt = function() { return Promise.resolve(); };
    event.userChoice = Promise.resolve({ outcome: 'accepted' });
    
    // Dispatch the event
    window.dispatchEvent(event);
  `
});
await puppeteer_screenshot_Puppeteer({ name: "install-prompt" });
```

## Responsive Design Testing

### Testing on Different Viewport Sizes

```javascript
// Test on mobile viewport (iPhone X)
await puppeteer_evaluate_Puppeteer({
  script: `
    window.innerWidth = 375;
    window.innerHeight = 812;
    window.dispatchEvent(new Event('resize'));
  `
});
await puppeteer_screenshot_Puppeteer({ 
  name: "mobile-viewport",
  width: 375,
  height: 812
});

// Test on tablet viewport (iPad)
await puppeteer_evaluate_Puppeteer({
  script: `
    window.innerWidth = 768;
    window.innerHeight = 1024;
    window.dispatchEvent(new Event('resize'));
  `
});
await puppeteer_screenshot_Puppeteer({ 
  name: "tablet-viewport",
  width: 768,
  height: 1024
});

// Test on desktop viewport
await puppeteer_evaluate_Puppeteer({
  script: `
    window.innerWidth = 1280;
    window.innerHeight = 800;
    window.dispatchEvent(new Event('resize'));
  `
});
await puppeteer_screenshot_Puppeteer({ 
  name: "desktop-viewport",
  width: 1280,
  height: 800
});
```

## Automated Test Script

Here's a complete script that can be used to run all the tests in sequence:

```javascript
async function runAllTests() {
  // Setup
  await puppeteer_navigate_Puppeteer({ url: "http://localhost:5137/" });
  await clearBrowserData();
  await puppeteer_screenshot_Puppeteer({ name: "initial-state" });
  
  // Exercise Feature Testing
  await testExerciseFeature();
  
  // Program Feature Testing
  await testProgramFeature();
  
  // Workout Feature Testing
  await testWorkoutFeature();
  
  // History Feature Testing
  await testHistoryFeature();
  
  // PWA Feature Testing
  await testPWAFeatures();
  
  // Responsive Design Testing
  await testResponsiveDesign();
  
  console.log("All tests completed successfully!");
}

// Helper function to clear browser data
async function clearBrowserData() {
  await puppeteer_evaluate_Puppeteer({
    script: `
      // Clear localStorage
      localStorage.clear();
      // Clear sessionStorage
      sessionStorage.clear();
      // Clear IndexedDB
      indexedDB.databases().then(dbs => {
        dbs.forEach(db => {
          indexedDB.deleteDatabase(db.name);
        });
      });
      // Reload the page
      window.location.reload();
    `
  });
}

// Run all tests
runAllTests().catch(console.error);
```

## Test Results Analysis

After running the tests, analyze the screenshots to verify:

1. **UI Consistency**: Check that all UI elements are properly aligned and styled consistently across different screens.
2. **Functionality**: Verify that all features work as expected (adding, editing, deleting, etc.).
3. **Responsive Design**: Ensure the application looks good and functions well on different screen sizes.
4. **Error Handling**: Check that error states are properly displayed and handled.
5. **Data Persistence**: Verify that data is properly saved and retrieved from IndexedDB.

Document any issues found and create tickets for them to be addressed in future updates.
