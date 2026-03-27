import { create } from 'zustand';
import type { Club, ClubInsert, ClubStatus } from '../types';
import {
  getAllClubs,
  insertClub,
  updateClub as dbUpdateClub,
  updateClubStatus as dbUpdateClubStatus,
  deleteClub as dbDeleteClub,
  addToSyncQueue,
  upsertClub,
} from '../services/database';
import {
  createClubRemote,
  getClubsRemote,
  updateClubRemote,
  deleteClubRemote,
} from '../services/firestoreService';

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
      let clubsData: Club[] = [];
      try {
        // Try Firebase first
        clubsData = await getClubsRemote();
        
        // Sync fetched data to local SQLite to avoid Foreign Key errors in relations
        for (const club of clubsData) {
          await upsertClub(club);
        }

        if (clubsData.length === 0) throw new Error('No data in Firebase or offline');
      } catch (fbError) {
        console.warn('Firebase getClubsRemote failed, falling back to SQLite:', fbError);
        clubsData = await getAllClubs();
      }
      set({ clubs: clubsData, loading: false });
    } catch (err) {
      console.warn('Kulüpler yüklenemedi:', err);
      set({ loading: false });
    }
  },

  addClub: async (data) => {
    // 1. SQLite'a ekle (id ve createdAt burada oluşur)
    const club = await insertClub(data);

    // 2. Firebase'e atmaya çalış
    try {
      await createClubRemote(club);
    } catch (err) {
      console.warn('Firebase add failed, pushing to sync queue:', err);
      // Başarısız olursa kuyruğa at
      await addToSyncQueue('clubs', club.id, 'insert', club);
    }

    // 3. UI'ı anında güncelle
    set((s) => ({ clubs: [club, ...s.clubs] }));
    return club;
  },

  updateClub: async (id, data) => {
    // 1. SQLite'ı güncelle
    await dbUpdateClub(id, data);

    // 2. Firebase'i güncellemeye çalış
    try {
      await updateClubRemote(id, data);
    } catch (err) {
      console.warn('Firebase update failed, pushing to sync queue:', err);
      await addToSyncQueue('clubs', id, 'update', data);
    }

    // 3. UI'ı güncelle
    set((s) => ({ clubs: s.clubs.map((c) => (c.id === id ? { ...c, ...data } : c)) }));
  },

  changeStatus: async (id, status) => {
    await dbUpdateClubStatus(id, status);

    try {
      await updateClubRemote(id, { status });
    } catch (err) {
      console.warn('Firebase status update failed, pushing to sync queue:', err);
      await addToSyncQueue('clubs', id, 'update', { status });
    }

    set((s) => ({ clubs: s.clubs.map((c) => (c.id === id ? { ...c, status } : c)) }));
  },

  removeClub: async (id) => {
    await dbDeleteClub(id);

    try {
      await deleteClubRemote(id);
    } catch (err) {
      console.warn('Firebase delete failed, pushing to sync queue:', err);
      await addToSyncQueue('clubs', id, 'delete');
    }

    set((s) => ({ clubs: s.clubs.filter((c) => c.id !== id) }));
  },
}));

