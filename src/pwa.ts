/**
 * PWA registration and service worker management
 */

// Register the service worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker available');
              // Dispatch an event that can be caught by the update notification component
              window.dispatchEvent(new CustomEvent('pwaUpdate'));
            }
          });
        }
      });
      
      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
      
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
};

// Check if the app is running in standalone mode (installed PWA)
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

// Check if the device is online
export const isOnline = () => {
  return navigator.onLine;
};

// Initialize PWA features
export const initPWA = () => {
  registerServiceWorker();
};
