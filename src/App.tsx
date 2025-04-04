import { useState, useEffect } from 'react'
import './App.css'

// Import hooks
import { useExercises } from './features/exercise'
import { usePrograms } from './features/program'
import { useWorkout } from './features/workout'
import { useHistory } from './features/history'

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
          <div>
            <h2>Exercises</h2>
            <p>Here you'll manage your exercise library.</p>
          </div>
        )}

        {activeTab === 'programs' && (
          <div>
            <h2>Programs</h2>
            <p>Create and manage your workout programs here.</p>
          </div>
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
