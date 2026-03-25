import { create } from 'zustand';
import type { Tournament, TournamentInsert } from '../types';
import {
  getAllTournaments,
  insertTournament,
  updateTournament as dbUpdateTournament,
  deleteTournament as dbDeleteTournament,
} from '../services/database';

type TournamentStore = {
  tournaments: Tournament[];
  loading: boolean;
  loadTournaments: () => Promise<void>;
  addTournament: (data: TournamentInsert) => Promise<Tournament>;
  updateTournament: (id: string, data: Partial<TournamentInsert>) => Promise<void>;
  removeTournament: (id: string) => Promise<void>;
};

export const useTournamentStore = create<TournamentStore>((set) => ({
  tournaments: [],
  loading: true,

  loadTournaments: async () => {
    try {
      set({ loading: true });
      const tournaments = await getAllTournaments();
      set({ tournaments, loading: false });
    } catch (err) {
      console.warn('Turnuvalar yüklenemedi:', err);
      set({ loading: false });
    }
  },

  addTournament: async (data) => {
    const tournament = await insertTournament(data);
    set((s) => ({ tournaments: [tournament, ...s.tournaments] }));
    return tournament;
  },

  updateTournament: async (id, data) => {
    await dbUpdateTournament(id, data);
    set((s) => ({
      tournaments: s.tournaments.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  },

  removeTournament: async (id) => {
    await dbDeleteTournament(id);
    set((s) => ({ tournaments: s.tournaments.filter((t) => t.id !== id) }));
  },
}));
