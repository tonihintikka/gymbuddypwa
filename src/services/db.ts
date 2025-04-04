/**
 * IndexedDB service for the GymTrack PWA application
 */

const DB_NAME = 'gymtrack-db';
const DB_VERSION = 1;

// Object store names
export const STORES = {
  EXERCISES: 'exercises',
  PROGRAMS: 'programs',
  WORKOUT_LOGS: 'workoutLogs',
  SETTINGS: 'settings',
};

// Database connection
let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Get a singleton database connection
 */
export const getDatabase = (): Promise<IDBDatabase> => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      console.log('Opening IndexedDB connection to', DB_NAME);
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('Error opening database:', event);
        dbPromise = null; // Reset so we can try again
        reject('Error opening database');
      };

      request.onsuccess = (event) => {
        console.log('IndexedDB connection opened successfully');
        const db = (event.target as IDBOpenDBRequest).result;

        // Handle connection closing
        db.onclose = () => {
          console.log('IndexedDB connection closed');
          dbPromise = null; // Reset the promise so a new connection will be created
        };

        // Handle connection errors
        db.onerror = (event) => {
          console.error('Database error:', event);
        };

        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        console.log('Upgrading IndexedDB database schema');
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(STORES.EXERCISES)) {
          console.log('Creating exercises store');
          db.createObjectStore(STORES.EXERCISES, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.PROGRAMS)) {
          console.log('Creating programs store');
          db.createObjectStore(STORES.PROGRAMS, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.WORKOUT_LOGS)) {
          console.log('Creating workoutLogs store');
          db.createObjectStore(STORES.WORKOUT_LOGS, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          console.log('Creating settings store');
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
        }
      };
    });
  }

  return dbPromise;
};

/**
 * Initialize the IndexedDB database
 */
export const initDatabase = (): Promise<IDBDatabase> => {
  return getDatabase();
};

/**
 * Save an item to the specified object store
 */
export const saveItem = <T>(storeName: string, item: T): Promise<T> => {
  return new Promise((resolve, reject) => {
    getDatabase().then(db => {
      try {
        console.log(`Saving item to ${storeName}:`, item);
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onsuccess = () => {
          console.log(`Item saved successfully to ${storeName}`);
          resolve(item);
        };

        request.onerror = (event) => {
          console.error(`Error saving item to ${storeName}:`, event);
          reject('Error saving item to database');
        };

        transaction.oncomplete = () => {
          console.log(`Transaction completed for saving to ${storeName}`);
        };

        transaction.onerror = (event) => {
          console.error(`Transaction error for saving to ${storeName}:`, event);
        };
      } catch (error) {
        console.error(`Exception while saving to ${storeName}:`, error);
        reject(error);
      }
    }).catch(error => {
      console.error('Database connection error:', error);
      reject(error);
    });
  });
};

/**
 * Get all items from the specified object store
 */
export const getAllItems = <T>(storeName: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    getDatabase().then(db => {
      try {
        console.log(`Getting all items from ${storeName}`);
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          console.log(`Retrieved ${request.result.length} items from ${storeName}`);
          resolve(request.result as T[]);
        };

        request.onerror = (event) => {
          console.error(`Error getting items from ${storeName}:`, event);
          reject('Error getting items from database');
        };
      } catch (error) {
        console.error(`Exception while getting items from ${storeName}:`, error);
        reject(error);
      }
    }).catch(error => {
      console.error('Database connection error:', error);
      reject(error);
    });
  });
};

/**
 * Get an item by ID from the specified object store
 */
export const getItemById = <T>(storeName: string, id: string): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    getDatabase().then(db => {
      try {
        console.log(`Getting item with ID ${id} from ${storeName}`);
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => {
          console.log(`Retrieved item from ${storeName}:`, request.result);
          resolve(request.result as T || null);
        };

        request.onerror = (event) => {
          console.error(`Error getting item from ${storeName}:`, event);
          reject('Error getting item from database');
        };
      } catch (error) {
        console.error(`Exception while getting item from ${storeName}:`, error);
        reject(error);
      }
    }).catch(error => {
      console.error('Database connection error:', error);
      reject(error);
    });
  });
};

/**
 * Delete an item by ID from the specified object store
 */
export const deleteItem = (storeName: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    getDatabase().then(db => {
      try {
        console.log(`Deleting item with ID ${id} from ${storeName}`);
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => {
          console.log(`Item deleted successfully from ${storeName}`);
          resolve();
        };

        request.onerror = (event) => {
          console.error(`Error deleting item from ${storeName}:`, event);
          reject('Error deleting item from database');
        };
      } catch (error) {
        console.error(`Exception while deleting from ${storeName}:`, error);
        reject(error);
      }
    }).catch(error => {
      console.error('Database connection error:', error);
      reject(error);
    });
  });
};
