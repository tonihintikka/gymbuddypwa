import { useState, useEffect } from 'react';
import './OfflineIndicator.css';

export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="offline-indicator" role="status" aria-live="polite">
      <span className="offline-icon" aria-hidden>⚠️</span>
      <span className="offline-text">
        Offline mode — workouts and data are saved locally on this device.
      </span>
    </div>
  );
};
