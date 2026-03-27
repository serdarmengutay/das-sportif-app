import { create } from 'zustand';
import type { Tournament, TournamentInsert } from '../types';
import {
  getAllTournaments,
  insertTournament,
  updateTournament as dbUpdateTournament,
  deleteTournament as dbDeleteTournament,
  addToSyncQueue,
  upsertTournament,
} from '../services/database';
import {
  createTournamentRemote,
  getTournamentsRemote,
  updateTournamentRemote,
  deleteTournamentRemote,
} from '../services/firestoreService';

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
      let tournamentsData: Tournament[] = [];
      try {
        tournamentsData = await getTournamentsRemote();

        // Sync to local to avoid FK errors
        for (const t of tournamentsData) {
          await upsertTournament(t);
        }

        if (tournamentsData.length === 0) throw new Error('No data in Firebase');
      } catch (fbError) {
        console.warn('Firebase getTournamentsRemote failed, falling back to SQLite:', fbError);
        tournamentsData = await getAllTournaments();
      }
      set({ tournaments: tournamentsData, loading: false });
    } catch (err) {
      console.warn('Turnuvalar yüklenemedi:', err);
      set({ loading: false });
    }
  },

  addTournament: async (data) => {
    const tournament = await insertTournament(data);

    try {
      await createTournamentRemote(tournament);
    } catch (err) {
      console.warn('Firebase add failed, pushing to sync queue:', err);
      await addToSyncQueue('tournaments', tournament.id, 'insert', tournament);
    }

    set((s) => ({ tournaments: [tournament, ...s.tournaments] }));
    return tournament;
  },

  updateTournament: async (id, data) => {
    await dbUpdateTournament(id, data);

    try {
      await updateTournamentRemote(id, data);
    } catch (err) {
      console.warn('Firebase update failed, pushing to sync queue:', err);
      await addToSyncQueue('tournaments', id, 'update', data);
    }

    set((s) => ({
      tournaments: s.tournaments.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  },

  removeTournament: async (id) => {
    await dbDeleteTournament(id);

    try {
      await deleteTournamentRemote(id);
    } catch (err) {
      console.warn('Firebase delete failed, pushing to sync queue:', err);
      await addToSyncQueue('tournaments', id, 'delete');
    }

    set((s) => ({ tournaments: s.tournaments.filter((t) => t.id !== id) }));
  },
}));
