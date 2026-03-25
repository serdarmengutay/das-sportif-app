import { create } from 'zustand';
import type { Club, ClubInsert, ClubStatus } from '../types';
import {
  getAllClubs,
  insertClub,
  updateClub as dbUpdateClub,
  updateClubStatus as dbUpdateClubStatus,
  deleteClub as dbDeleteClub,
} from '../services/database';

type ClubStore = {
  clubs: Club[];
  loading: boolean;
  loadClubs: () => Promise<void>;
  addClub: (data: ClubInsert) => Promise<Club>;
  updateClub: (id: string, data: Partial<ClubInsert>) => Promise<void>;
  changeStatus: (id: string, status: ClubStatus) => Promise<void>;
  removeClub: (id: string) => Promise<void>;
};

export const useClubStore = create<ClubStore>((set) => ({
  clubs: [],
  loading: true,

  loadClubs: async () => {
    try {
      set({ loading: true });
      const clubs = await getAllClubs();
      set({ clubs, loading: false });
    } catch (err) {
      console.warn('Kulüpler yüklenemedi:', err);
      set({ loading: false });
    }
  },

  addClub: async (data) => {
    const club = await insertClub(data);
    set((s) => ({ clubs: [club, ...s.clubs] }));
    return club;
  },

  updateClub: async (id, data) => {
    await dbUpdateClub(id, data);
    set((s) => ({ clubs: s.clubs.map((c) => (c.id === id ? { ...c, ...data } : c)) }));
  },

  changeStatus: async (id, status) => {
    await dbUpdateClubStatus(id, status);
    set((s) => ({ clubs: s.clubs.map((c) => (c.id === id ? { ...c, status } : c)) }));
  },

  removeClub: async (id) => {
    await dbDeleteClub(id);
    set((s) => ({ clubs: s.clubs.filter((c) => c.id !== id) }));
  },
}));
