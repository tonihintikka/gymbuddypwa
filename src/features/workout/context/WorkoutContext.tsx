import React, { createContext, useContext, ReactNode } from 'react';
import { useWorkout } from '../hooks/useWorkout';

// Define the context type
export type WorkoutContextType = ReturnType<typeof useWorkout>;

// Create context with default values
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Create provider component
export const WorkoutProvider: React.FC<{ children: ReactNode, value: WorkoutContextType }> = ({ children, value }) => {
  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom hook for using this context
export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkoutContext must be used within a WorkoutProvider');
  }
  return context;
}; 