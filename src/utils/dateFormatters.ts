/**
 * Date formatting utility functions
 */

/**
 * Format a date as a readable string (e.g., "Monday, January 1, 2023")
 */
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a date as a short string (e.g., "Jan 1, 2023")
 */
export const formatShortDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date as time (e.g., "3:30 PM")
 */
export const formatTime = (date: Date): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
