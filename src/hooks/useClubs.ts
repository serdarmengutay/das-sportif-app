import { useEffect } from 'react';
import { useClubStore } from '../store/useClubStore';

export const useClubs = () => {
  const store = useClubStore();

  useEffect(() => {
    store.loadClubs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return store;
};
