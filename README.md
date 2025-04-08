# GymBuddy PWA

A progressive web application for tracking workouts and fitness progress.

## About

GymBuddy is a modern, mobile-first PWA (Progressive Web Application) designed to help users track their workouts and fitness journey. The application works entirely client-side, storing all data in the browser's storage or the PWA's memory when installed. This means your workout data stays on your device and is available even without an internet connection.

## Features

- **Offline Support**: Works without an internet connection
- **Mobile-First Design**: Optimized for use during workouts on mobile devices
- **Exercise Library**: Contains 80+ built-in exercises organized by muscle group
- **Workout Programs**: Includes multiple pre-defined workout programs
- **Custom Workouts**: Create and save your own custom workouts
- **Progress Tracking**: Log sets, reps, and weights for each exercise
- **Workout History**: View your past workouts and track progress over time
- **Installable**: Can be installed as a PWA on your mobile device or desktop

## Technology

GymBuddy is built with:

- **Vite**: Next-generation front-end tooling
- **React**: For component-based UI
- **TypeScript**: For type safety
- **IndexedDB**: For client-side data storage
- **PWA Features**: For offline functionality and installability

## Getting Started

### Online Version

Visit the deployed application at [https://gymbuddypwa.vercel.app](https://gymbuddypwa.vercel.app)

### Development

To run the project locally:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to the URL displayed in the terminal (typically `http://localhost:5173`)

## Installation as PWA

On compatible browsers (Chrome, Edge, Firefox, etc.):

1. Navigate to the app in your browser
2. Look for the "Install" or "Add to Home Screen" option in your browser menu
3. Follow the prompts to install the app

Once installed, GymBuddy will appear as an app on your device and can be used offline.

## Data Storage

All your workout data is stored locally in your browser using IndexedDB. No data is sent to any server, which means:

- Your data is private
- The app works offline
- You can use the app without creating an account

Note that clearing your browser data will also remove your saved workouts and programs.

## License

This project is open source and available under the MIT license.
