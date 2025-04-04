/**
 * Custom hook for interacting with IndexedDB
 */
import { useState, useEffect, useCallback } from 'react';
import { saveItem, getAllItems, getItemById, deleteItem } from '../services/db';

/**
 * Generic hook for managing data in IndexedDB
 */
export function useIndexedDB<T>(storeName: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all items from the store
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllItems<T>(storeName);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [storeName]);

  // Load items on mount
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Save an item to the store
  const saveItemToStore = useCallback(async (item: T) => {
    try {
      setError(null);
      await saveItem<T>(storeName, item);
      await loadItems(); // Reload items after saving
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  }, [storeName, loadItems]);

  // Get an item by ID
  const getItem = useCallback(async (id: string) => {
    try {
      setError(null);
      return await getItemById<T>(storeName, id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  }, [storeName]);

  // Delete an item by ID
  const deleteItemFromStore = useCallback(async (id: string) => {
    try {
      setError(null);
      await deleteItem(storeName, id);
      await loadItems(); // Reload items after deleting
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  }, [storeName, loadItems]);

  return {
    items,
    loading,
    error,
    loadItems,
    saveItem: saveItemToStore,
    getItem,
    deleteItem: deleteItemFromStore,
  };
}
