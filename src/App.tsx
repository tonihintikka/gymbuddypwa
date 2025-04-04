import { useState, useEffect } from 'react'
import './App.css'

// Import hooks and components
import { useExercises, ExerciseScreen } from './features/exercise'
import { usePrograms, ProgramScreen } from './features/program'
import { useWorkout } from './features/workout'
import { useHistory } from './features/history'

// Import CSS for features
import './features/exercise/components/Exercise.css'
import './features/program/components/Program.css'

// Import database initialization
import { initDatabase } from './services/db'

function App() {
  const [initialized, setInitialized] = useState(false)
  const [activeTab, setActiveTab] = useState('workout')

  // Initialize the database on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase()
        setInitialized(true)
      } catch (error) {
        console.error('Failed to initialize database:', error)
      }
    }

    init()
  }, [])

  // Render loading state while initializing
  if (!initialized) {
    return (
      <div className="app-container">
        <h1>GymTrack PWA</h1>
        <p>Initializing application...</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>GymTrack PWA</h1>
      </header>

      <main className="app-content">
        {activeTab === 'workout' && (
          <div>
            <h2>Start Workout</h2>
            <p>This is where you'll start and track your workouts.</p>
          </div>
        )}

        {activeTab === 'exercises' && (
          <ExerciseScreen />
        )}

        {activeTab === 'programs' && (
          <ProgramScreen />
        )}

        {activeTab === 'history' && (
          <div>
            <h2>History</h2>
            <p>View your workout history and progress.</p>
          </div>
        )}
      </main>

      <nav className="app-nav">
        <button
          className={activeTab === 'workout' ? 'active' : ''}
          onClick={() => setActiveTab('workout')}
        >
          Workout
        </button>
        <button
          className={activeTab === 'exercises' ? 'active' : ''}
          onClick={() => setActiveTab('exercises')}
        >
          Exercises
        </button>
        <button
          className={activeTab === 'programs' ? 'active' : ''}
          onClick={() => setActiveTab('programs')}
        >
          Programs
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </nav>
    </div>
  )
}

export default App
