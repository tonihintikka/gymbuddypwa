import { useState, useEffect } from 'react';
import './PWAUpdateNotification.css';

export const PWAUpdateNotification = () => {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  useEffect(() => {
    // Check if the app is in PWA mode
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;

    if (!isPWA && !('serviceWorker' in navigator)) {
      return;
    }

    // Listen for service worker update events
    const handleServiceWorkerUpdate = () => {
      setShowUpdateNotification(true);
    };

    // Register event listener for update found
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleServiceWorkerUpdate);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleServiceWorkerUpdate);
      }
    };
  }, []);

  const handleUpdate = () => {
    // Reload the page to get the latest version
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdateNotification(false);
  };

  if (!showUpdateNotification) return null;

  return (
    <div className="pwa-update-notification">
      <div className="notification-content">
        <div className="notification-text">
          <p>A new version of GymTrack is available!</p>
        </div>
        <div className="notification-actions">
          <button className="update-button" onClick={handleUpdate}>
            Update Now
          </button>
          <button className="dismiss-button" onClick={handleDismiss}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
};
