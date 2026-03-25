import { useEffect } from 'react';
import { useTournamentStore } from '../store/useTournamentStore';

export const useTournaments = () => {
  const store = useTournamentStore();

  useEffect(() => {
    store.loadTournaments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return store;
};
