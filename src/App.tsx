import { useState, useEffect } from 'react'
import './App.css'

// Import hooks and components
import { useExercises, ExerciseScreen } from './features/exercise'
import { usePrograms, ProgramScreen } from './features/program'
import { useWorkout, WorkoutScreen, WorkoutProvider } from './features/workout'
import { useHistory, HistoryScreen } from './features/history'
import { ProgressScreen } from './features/progress'

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
  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('activeTab') : null
    return saved || 'workout'
  })
  const workout = useWorkout()

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

  // Persist last active tab
  useEffect(() => {
    try {
      window.localStorage.setItem('activeTab', activeTab)
      // Optional hash sync for simple deep links
      window.location.hash = `#${activeTab}`
    } catch (_) {}
  }, [activeTab])

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
    <WorkoutProvider value={workout}>
      <div className="app-container">
        <OfflineIndicator />
        <PWAUpdateNotification />
        <PWAInstallPrompt />

        <header className="app-header" role="banner">
          <h1>
            <img src="/icons/icon.svg" alt="GymTrack" className="app-logo" />
            GymTrack
          </h1>
          <div className="header-actions">
            {/* Add any header actions here if needed */}
          </div>
        </header>

        <main className="app-content" role="main">
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

          {activeTab === 'progress' && (
            <ProgressScreen />
          )}
        </main>

        <nav className="app-nav" role="navigation" aria-label="Bottom navigation">
          <button
            className={activeTab === 'workout' ? 'active' : ''}
            onClick={() => setActiveTab('workout')}
            aria-current={activeTab === 'workout' ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden>
              <img src="/icons/nav-workout.svg" alt="" />
            </span>
            <span className="nav-label">Workout</span>
          </button>
          <button
            className={activeTab === 'exercises' ? 'active' : ''}
            onClick={() => setActiveTab('exercises')}
            aria-current={activeTab === 'exercises' ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden>
              <img src="/icons/nav-exercises.svg" alt="" />
            </span>
            <span className="nav-label">Exercises</span>
          </button>
          <button
            className={activeTab === 'programs' ? 'active' : ''}
            onClick={() => setActiveTab('programs')}
            aria-current={activeTab === 'programs' ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden>
              <img src="/icons/nav-programs.svg" alt="" />
            </span>
            <span className="nav-label">Programs</span>
          </button>
          <button
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
            aria-current={activeTab === 'history' ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden>
              <img src="/icons/nav-history.svg" alt="" />
            </span>
            <span className="nav-label">History</span>
          </button>
          <button
            className={activeTab === 'progress' ? 'active' : ''}
            onClick={() => setActiveTab('progress')}
            aria-current={activeTab === 'progress' ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden>
              <img src="/icons/nav-progress.svg" alt="" />
            </span>
            <span className="nav-label">Progress</span>
          </button>
        </nav>
      </div>
    </WorkoutProvider>
  )
}

export default App
