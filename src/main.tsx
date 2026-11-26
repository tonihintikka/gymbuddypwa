import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// autoUpdate reloads when a new worker activates (event.isUpdate).
// iOS standalone often will not check for that worker until the app is foregrounded.
const updateServiceWorker = registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) return
    const check = () => {
      registration.update().catch(() => {})
    }
    check()
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') check()
    })
    window.setInterval(check, 60 * 60 * 1000)
  },
})

void updateServiceWorker

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
