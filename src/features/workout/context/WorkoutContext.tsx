import React, { createContext, useState, useContext, ReactNode } from 'react';
import { WorkoutLog } from '../../../types/models';

// Define the context type
interface WorkoutContextType {
  workout: WorkoutLog | null;
  setWorkout: (workout: WorkoutLog | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
}

// Create context with default values
const WorkoutContext = createContext<WorkoutContextType>({
  workout: null,
  setWorkout: () => {},
  loading: false,
  setLoading: () => {},
  error: null,
  setError: () => {},
});

// Create provider component
export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workout, setWorkout] = useState<WorkoutLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return (
    <WorkoutContext.Provider
      value={{
        workout,
        setWorkout,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom hook for using this context
export const useWorkoutContext = () => useContext(WorkoutContext); 