import { create } from 'zustand';
import type { ClubTournament } from '../types';
import {
  getAllClubTournaments,
  linkClubTournament,
  unlinkClubTournament,
} from '../services/database';
import {
  linkClubTournamentRemote,
  unlinkClubTournamentRemote,
} from '../services/firestoreService';

type ClubTournamentStore = {
  relations: ClubTournament[];
  loading: boolean;
  loadRelations: () => Promise<void>;
  link: (clubId: string, tournamentId: string) => Promise<ClubTournament>;
  unlink: (id: string) => Promise<void>;
  getClubIds: (tournamentId: string) => string[];
  getTournamentIds: (clubId: string) => string[];
};

export const useClubTournamentStore = create<ClubTournamentStore>((set, get) => ({
  relations: [],
  loading: true,

  loadRelations: async () => {
    try {
      set({ loading: true });
      const relations = await getAllClubTournaments();
      set({ relations, loading: false });
    } catch (err) {
      console.warn('İlişkiler yüklenemedi:', err);
      set({ loading: false });
    }
  },

  link: async (clubId, tournamentId) => {
    const rel = await linkClubTournament(clubId, tournamentId);
    try {
      await linkClubTournamentRemote(rel);
    } catch (err) {
      console.warn('Firebase ilişki senkronizasyon hatası:', err);
    }
    set((s) => ({ relations: [...s.relations, rel] }));
    return rel;
  },

  unlink: async (id) => {
    await unlinkClubTournament(id);
    try {
      await unlinkClubTournamentRemote(id);
    } catch (err) {
      console.warn('Firebase ilişki silme senkronizasyon hatası:', err);
    }
    set((s) => ({ relations: s.relations.filter((r) => r.id !== id) }));
  },

  getClubIds: (tournamentId) =>
    get()
      .relations.filter((r) => r.tournamentId === tournamentId)
      .map((r) => r.clubId),

  getTournamentIds: (clubId) =>
    get()
      .relations.filter((r) => r.clubId === clubId)
      .map((r) => r.tournamentId),
}));
