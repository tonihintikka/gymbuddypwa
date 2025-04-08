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

## Development Process

### Overview

GymBuddy is a Progressive Web Application (PWA) for fitness tracking developed using an agent-based development approach with multiple AI models. The entire development process took approximately 5.5 hours spread across two days.

### Multi-Model AI Development Workflow

This project leveraged multiple AI models in a coordinated workflow to maximize efficiency:

1. **Google Gemini 2.5 Pro**: Used for initial specifications and planning, defining core features, data models, and implementation patterns for both Flutter and PWA versions.

2. **Claude**: Employed to develop Cursor rules that would guide AI agents during implementation. These rules were iteratively refined to be concise and directive rather than overly detailed.

3. **Augment Code**: Generated the actual implementation code based on the specifications and rules, and created a structured to-do list for tracking development progress.

4. **Cursor**: Used for debugging, fixing UI errors, and making deployment configurations.

### Development Timeline

#### April 4, 2025 (4 hours)
- **19:00**: Project initiated with Google Gemini 2.5 Pro to create detailed specifications
- **20:00**: Worked with Claude to create proper Cursor rules for implementation
- **21:00**: Generated implementation code with Augment Code
- **22:40**: Completed initial working version of the application

#### April 7, 2025 (1.5 hours)
- Fixed UI errors and navigation issues using Cursor
- Made configuration changes for Vercel deployment
- Prepared the app for publication on the Vercel platform

### Technical Implementation

The application was built as a React-based PWA with TypeScript and features:

- Feature-based code organization (exercises, programs, workouts, history)
- IndexedDB for local data storage and offline functionality
- Custom React hooks for state management
- TypeScript interfaces for robust data modeling
- PWA capabilities including offline access and installability
- Tab-based navigation system for intuitive user experience

### Key Insights from the Process

1. **Effective AI Guidance**: The quality of guidance provided to AI models directly impacts the quality of generated code. Well-structured, concise rules yield better results than exhaustive documentation.

2. **Complementary AI Models**: Different AI models have distinct strengths that can be leveraged for specific tasks in the development process.

3. **Development Speed**: By coordinating multiple AI models with proper guidance, development time was dramatically reduced while maintaining quality.

4. **Iterative Rule Refinement**: Cursor rules were refined through experience to focus on patterns and principles rather than detailed implementations, improving overall development efficiency.

This project demonstrates how agent-based development with multiple AI models can dramatically accelerate application development without sacrificing quality.

## License

This project is open source and available under the MIT license.
