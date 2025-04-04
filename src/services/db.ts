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

/**
 * Initialize the IndexedDB database
 */
export const initDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject('Error opening database');
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.EXERCISES)) {
        db.createObjectStore(STORES.EXERCISES, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.PROGRAMS)) {
        db.createObjectStore(STORES.PROGRAMS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.WORKOUT_LOGS)) {
        db.createObjectStore(STORES.WORKOUT_LOGS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Save an item to the specified object store
 */
export const saveItem = <T>(storeName: string, item: T): Promise<T> => {
  return new Promise((resolve, reject) => {
    initDatabase().then(db => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);

      request.onsuccess = () => {
        resolve(item);
      };

      request.onerror = () => {
        reject('Error saving item to database');
      };
    }).catch(reject);
  });
};

/**
 * Get all items from the specified object store
 */
export const getAllItems = <T>(storeName: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    initDatabase().then(db => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as T[]);
      };

      request.onerror = () => {
        reject('Error getting items from database');
      };
    }).catch(reject);
  });
};

/**
 * Get an item by ID from the specified object store
 */
export const getItemById = <T>(storeName: string, id: string): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    initDatabase().then(db => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result as T || null);
      };

      request.onerror = () => {
        reject('Error getting item from database');
      };
    }).catch(reject);
  });
};

/**
 * Delete an item by ID from the specified object store
 */
export const deleteItem = (storeName: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    initDatabase().then(db => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject('Error deleting item from database');
      };
    }).catch(reject);
  });
};
