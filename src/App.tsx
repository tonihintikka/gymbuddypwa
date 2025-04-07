import { useState, useEffect } from 'react'
import './App.css'

// Import hooks and components
import { useExercises, ExerciseScreen } from './features/exercise'
import { usePrograms, ProgramScreen } from './features/program'
import { useWorkout, WorkoutScreen } from './features/workout'
import { useHistory, HistoryScreen } from './features/history'

// Import PWA components
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import { PWAUpdateNotification } from './components/PWAUpdateNotification'
import { OfflineIndicator } from './components/OfflineIndicator'

// Import CSS for features
import './features/exercise/components/Exercise.css'
import './features/program/components/Program.css'
import './features/workout/components/Workout.css'
import './features/history/components/History.css'

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
      <OfflineIndicator />
      <PWAUpdateNotification />
      <PWAInstallPrompt />

      <header className="app-header">
        <h1>
          <img src="/icons/icon.svg" alt="GymTrack" className="app-logo" />
          GymTrack
        </h1>
        <div className="header-actions">
          {/* Add any header actions here if needed */}
        </div>
      </header>

      <main className="app-content">
        {activeTab === 'workout' && (
          <WorkoutScreen />
        )}

        {activeTab === 'exercises' && (
          <ExerciseScreen />
        )}

        {activeTab === 'programs' && (
          <ProgramScreen />
        )}

        {activeTab === 'history' && (
          <HistoryScreen />
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
