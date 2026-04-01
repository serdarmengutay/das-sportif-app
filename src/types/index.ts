// ─── Club ─────────────────────────────────────────────────

export type ClubStatus = 'visited' | 'proposal' | 'negotiation' | 'deal';

export type Club = {
  id: string;
  name: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  status: ClubStatus;
  notes: string;
  coachPhone: string;
  coachName: string;
  createdAt: number;
};

export type ClubInsert = Omit<Club, 'id' | 'createdAt'>;

// ─── Tournament ───────────────────────────────────────────

export type TournamentStatus = 'active' | 'planned' | 'completed';

export type Tournament = {
  id: string;
  name: string;
  city: string;
  startDate: number | null;
  endDate: number | null;
  status: TournamentStatus;
  participantCount: number;
  locationName: string;
  createdAt: number;
};

export type TournamentInsert = Omit<Tournament, 'id' | 'createdAt'>;

// ─── Club ↔ Tournament (many-to-many) ────────────────────

export type ClubTournament = {
  id: string;
  clubId: string;
  tournamentId: string;
};

// ─── Sync Queue ───────────────────────────────────────────

export type SyncAction = 'insert' | 'update' | 'delete';

export type SyncQueueItem = {
  id: string;
  tableName: string;
  recordId: string;
  action: SyncAction;
  payload: string | null;
  createdAt: number;
  synced: number; // 0 | 1
};

// ─── Genel ────────────────────────────────────────────────

export type Coordinates = {
  latitude: number;
  longitude: number;
};
