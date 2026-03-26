/**
 * SQL şema sabitleri ve tablo oluşturma sorguları.
 */

export const CREATE_CLUBS_TABLE = `
  CREATE TABLE IF NOT EXISTS clubs (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT '',
    district TEXT NOT NULL DEFAULT '',
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'visited',
    createdAt INTEGER NOT NULL
  );
`;

export const CREATE_TOURNAMENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS tournaments (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    season TEXT NOT NULL DEFAULT '',
    startDate INTEGER,
    endDate INTEGER,
    notes TEXT NOT NULL DEFAULT '',
    createdAt INTEGER NOT NULL
  );
`;

export const CREATE_CLUB_TOURNAMENT_TABLE = `
  CREATE TABLE IF NOT EXISTS club_tournament (
    id TEXT PRIMARY KEY NOT NULL,
    clubId TEXT NOT NULL,
    tournamentId TEXT NOT NULL,
    FOREIGN KEY (clubId) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (tournamentId) REFERENCES tournaments(id) ON DELETE CASCADE
  );
`;

export const CREATE_SYNC_QUEUE_TABLE = `
  CREATE TABLE IF NOT EXISTS sync_queue (
    id TEXT PRIMARY KEY NOT NULL,
    tableName TEXT NOT NULL,
    recordId TEXT NOT NULL,
    action TEXT NOT NULL,
    payload TEXT,
    createdAt INTEGER NOT NULL,
    synced INTEGER NOT NULL DEFAULT 0
  );
`;
