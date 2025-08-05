# GymTrack PWA

A progressive web application for tracking weightlifting workouts with prioritization on simplicity and ease of use during active workouts.

## About

GymTrack is a modern, mobile-first PWA (Progressive Web Application) designed to help users track their weightlifting workouts with a focus on fast, simple interactions during active training sessions. The application works entirely offline, storing all data locally in IndexedDB. This means your workout data stays on your device and is available even without an internet connection.

## Features

### Core Workout Features
- **Fast Workout Logging**: Minimal taps required to log sets during active workouts
- **Exercise Management**: Built-in exercises with support for custom exercises
- **Flexible Set Logging**: Track weight, reps, and additional markers (failure, pause, slow eccentric)
- **Active Workout Screen**: Large, easily tappable controls optimized for gym use
- **Real-time Progress**: Clear visual indicators for logged sets and workout progress

### Program Management
- **Built-in Programs**: Multiple pre-defined workout programs (3-Day Split, Push/Pull/Legs, etc.)
- **Custom Programs**: Create your own workout program templates
- **Empty Workouts**: Start workouts without a program and save them as new programs
- **Program Templates**: Convert completed workouts into reusable program templates

### Data & Offline Support
- **Full Offline Functionality**: All core features work without network connectivity
- **IndexedDB Storage**: Local data storage with no external dependencies
- **Workout History**: Complete history of all logged workouts
- **Progress Visualization**: Track your performance with charts for key metrics like estimated 1RM, max weight, and total volume.
- **Data Export**: Export your workout data (planned feature)

### Technical Features
- **Progressive Web App**: Installable on mobile devices and desktop
- **Mobile-First Design**: Optimized for smartphone use during workouts
- **TypeScript**: Complete type safety throughout the application
- **Material UI**: Consistent, accessible user interface components

## Technology Stack

GymTrack is built with:

- **React 18**: Component-based UI with hooks for state management
- **TypeScript**: Complete type safety throughout the codebase
- **Vite**: Next-generation front-end build tooling
- **Material UI**: Consistent component library for UI elements
- **IndexedDB**: Client-side data storage for offline functionality
- **Service Worker**: For PWA features and offline capability
- **Web App Manifest**: For installability as a native-like app

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

Once installed, GymTrack will appear as an app on your device and can be used offline.

## Data Storage

All your workout data is stored locally in your browser using IndexedDB. No data is sent to any server, which means:

- Your data is private
- The app works offline
- You can use the app without creating an account

Note that clearing your browser data will also remove your saved workouts and programs.

## Development Process

### Overview

GymTrack is a Progressive Web Application (PWA) for weightlifting workout tracking developed using an agent-based development approach with multiple AI models. The initial development process took approximately 5.5 hours spread across two days, with ongoing improvements and bug fixes implemented using modern AI-assisted development practices.

### Multi-Model AI Development Workflow

This project leveraged multiple AI models in a coordinated workflow to maximize efficiency:

1. **Google Gemini 2.5 Pro**: Used for initial specifications and planning, defining core features, data models, and implementation patterns for both Flutter and PWA versions.

2. **Claude**: Employed to develop Cursor rules that would guide AI agents during implementation. These rules were iteratively refined to be concise and directive rather than overly detailed.

3. **Augment Code**: Generated the actual implementation code based on the specifications and rules, and created a structured to-do list for tracking development progress.

4. **Cursor**: Used for debugging, fixing UI errors, and making deployment configurations.

### Development Timeline

#### Phase 1: Initial Development (April 4-7, 2025)
**April 4, 2025 (4 hours)**
- **19:00**: Project initiated with Google Gemini 2.5 Pro to create detailed specifications
- **20:00**: Worked with Claude to create proper Cursor rules for implementation
- **21:00**: Generated implementation code with Augment Code
- **22:40**: Completed initial working version of the application

**April 7, 2025 (1.5 hours)**
- Fixed UI errors and navigation issues using Cursor
- Made configuration changes for Vercel deployment
- Prepared the app for publication on the Vercel platform

#### Phase 2: Core Feature Stabilization (2024-2025)
- **Workout Flow Improvements**: Enhanced empty workout to program conversion functionality
- **Data Persistence**: Fixed issues with exercise preservation during program creation
- **Code Quality**: Improved TypeScript safety and removed unused imports
- **Testing Infrastructure**: Refactored test suite and resolved linter errors
- **Documentation**: Enhanced project documentation and feature planning

#### Phase 3: Advanced Features (2025)
**Progress Visualization Feature**
- Implemented comprehensive progress tracking with Chart.js integration
- Added estimated 1RM calculations using Epley formula
- Created interactive charts for max weight, total volume, and rep tracking
- Built exercise-specific progress analysis with time-series data
- Integrated full navigation tab for progress monitoring

**Progress UX Enhancement**
- Developed smart exercise prioritization in Progress tab
- Implemented `useExercisesWithHistory` hook for workout data analysis
- Added exercise grouping: "Exercises with Data" vs "All Exercises"
- Integrated workout count display (e.g., "Bench Press (5 workouts)")
- Created visual separators and section headers for better UX
- Sorted exercises by usage frequency for optimal user experience

#### Phase 4: Development Workflow (2025)
- **Branching Strategy**: Established feature branches with proper merge workflows
- **Remote Backup**: Pushed all feature branches to GitHub for collaboration
- **Documentation**: Comprehensive feature planning and todo tracking
- **Quality Assurance**: Build verification and TypeScript compilation checks

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

### Current Status & Future Development

#### Latest Achievements (2025)
- ✅ **Full Progress Tracking**: Complete visualization system with charts and metrics
- ✅ **Smart Exercise Selection**: Intelligent prioritization based on workout history
- ✅ **Robust Data Flow**: Reliable workout-to-program conversion with race condition fixes
- ✅ **Enhanced UX**: Optimized user interface with clear visual hierarchy
- ✅ **Development Maturity**: Professional branching strategy and comprehensive documentation

#### Technical Maturity
The application has evolved from an initial MVP to a comprehensive fitness tracking solution with:
- **Feature-Complete Core**: All essential workout tracking functionality implemented
- **Advanced Analytics**: Progress visualization with mathematical workout analysis
- **User-Centric Design**: Interface optimized based on real-world usage patterns
- **Maintainable Codebase**: TypeScript safety, testing infrastructure, and modular architecture
- **Professional Workflow**: Feature branching, documentation, and quality assurance processes

#### Development Approach Evolution
The project demonstrates the progression from rapid AI-assisted prototyping to mature software development practices, showcasing how modern AI tools can accelerate both initial development and ongoing feature enhancement while maintaining code quality and user experience standards.

## License

This project is open source and available under the MIT license.
