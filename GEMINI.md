# Gemini Configuration for GymTrack PWA

This document provides instructions for the Gemini agent to effectively assist with development in this repository.

## 1. Core Commands

- **Install dependencies:** `npm install`
- **Run development server:** `npm run dev`
- **Run tests:** `npm test`
  - But please ask if you stuck writing tests.
- **Run linter:** `npm run lint`
- **Build for production:** `npm run build`

## 2. Architectural Conventions

- **State Management:** Use custom React Hooks (`useSomething`) and React Context for state management. The main workout state is managed in `src/features/workout/context/WorkoutContext.tsx`. Avoid introducing new state management libraries like Redux or Zustand.
- **Component Structure:** Components are organized by feature under `src/features/`. Each feature has its own `components`, `hooks`, and `__tests__` subdirectories. Shared components are in `src/components/`.
- **Styling:** Use Material UI for components and the `styled` API for component-specific styling. Do not introduce other styling libraries like styled-components or Tailwind CSS.
- **Data Models:** All core data types (e.g., `WorkoutLog`, `Exercise`, `Program`) are centralized in `src/types/models.ts`. Always use these types.
- **Database:** All IndexedDB logic is handled by the `src/services/db.ts` service and abstracted by the `useIndexedDB` hook. Do not interact with IndexedDB directly in components.
- **File Naming:**
    - Components: `PascalCase.tsx` (e.g., `ExerciseList.tsx`)
    - Hooks: `useCamelCase.ts` (e.g., `useExercises.ts`)
    - Utilities: `camelCase.ts` (e.g., `dateFormatters.ts`)

## 3. Key Files & Directories

- **`src/types/models.ts`**: The single source of truth for all data structures.
- **`src/services/db.ts`**: The core IndexedDB service definition.
- **`src/hooks/useIndexedDB.ts`**: The primary hook for interacting with the database.
- **`src/features/`**: All application features are modularized here. When adding a new feature, follow the existing structure.
- **`public/manifest.json`**: The PWA web app manifest.
- **`eslint.config.js`**: ESLint configuration.
- **`vite.config.ts`**: Vite configuration.

## 4. Development Goals & Rules

- **Goal:** This is a Progressive Web App (PWA). Offline-first capabilities, fast performance, and a mobile-first design are the highest priorities.
- **Rule:** Before committing, always run `npm test` and `npm run lint` to ensure all checks pass.
- **Rule:** When creating a new component, also create a corresponding test file under the `__tests__` directory.
- **Rule:** All interactive UI elements must have a minimum touch target of 48x48px.
- **Rule:** Use functional components with hooks. Avoid class components.
- **Rule:** Avoid the use of the `any` type in TypeScript. Use specific types or interfaces.
- **"Don't Touch":** Avoid making changes to configuration files like `vite.config.ts`, `tsconfig.json`, and `eslint.config.js` unless the task is specifically about changing project configuration.

## 5. PWA Requirements

- The app must be fully functional offline.
- Use a cache-first strategy for static assets and a network-first strategy for dynamic data.
- Ensure the `public/manifest.json` is correctly configured with all required icons.
