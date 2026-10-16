import { useState, useEffect, useMemo, useCallback } from 'react';
import { SavedContext } from './saved-context';

const STORAGE_KEY = 'render72_saved_events_v1';

function getInitialSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch (err) {
    console.warn('Could not read saved events from localStorage:', err);
  }
  return new Set();
}

export function SavedProvider({ children }) {
  const [savedIds, setSavedIds] = useState(getInitialSavedIds);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(savedIds)));
    } catch (err) {
      console.warn('Could not persist saved events to localStorage:', err);
    }
  }, [savedIds]);

  const toggleSave = useCallback((id) => {
    if (!id) return;
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isSaved = useCallback((id) => {
    return savedIds.has(id);
  }, [savedIds]);

  const value = useMemo(() => ({
    savedIds,
    isSaved,
    toggleSave,
    savedCount: savedIds.size,
  }), [savedIds, isSaved, toggleSave]);

  return (
    <SavedContext.Provider value={value}>
      {children}
    </SavedContext.Provider>
  );
}
