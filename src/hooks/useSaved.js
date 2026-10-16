import { useContext } from 'react';
import { SavedContext } from '../context/saved-context';

export function useSaved() {
  return useContext(SavedContext);
}
