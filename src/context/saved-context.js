import { createContext } from 'react';

export const SavedContext = createContext({
  savedIds: new Set(),
  isSaved: () => false,
  toggleSave: () => {},
  savedCount: 0,
});
