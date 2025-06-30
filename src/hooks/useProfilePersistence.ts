import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for persisting form state to localStorage.
 *
 * @param key The key to use for storing data in localStorage.
 * @param initialState The initial state of the form data.
 * @returns A tuple containing:
 *          - The current form data.
 *          - A function to update the form data.
 *          - A function to clear the persisted form data from localStorage.
 */
function useProfilePersistence<T>(key: string, initialState: T): [T, (newState: T) => void, () => void] {
  const [formData, setFormData] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialState;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialState;
    }
  });

  // Effect to save form data to localStorage whenever it changes.
  // Includes a debounce to prevent excessive writes.
  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(formData));
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    }, 500); // Save after 500ms of inactivity

    return () => {
      clearTimeout(handler);
    };
  }, [formData, key]);

  /**
   * Updates the form data. This function is memoized for stability.
   * @param newState The new state to set for the form data.
   */
  const updateFormData = useCallback((newState: T) => {
    setFormData(newState);
  }, []);

  /**
   * Clears the persisted form data from localStorage and resets the form state
   * to its initial value. This function is memoized for stability.
   */
  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setFormData(initialState); // Reset to initial state after clearing
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, [key, initialState]);

  return [formData, updateFormData, clearFormData];
}

export default useProfilePersistence;
