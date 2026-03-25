import * as SQLite from 'expo-sqlite';
import {
  CREATE_CLUBS_TABLE,
  CREATE_TOURNAMENTS_TABLE,
  CREATE_CLUB_TOURNAMENT_TABLE,
  CREATE_SYNC_QUEUE_TABLE,
} from '../database/schema';
import type {
  Club,
  ClubInsert,
  ClubStatus,
  Tournament,
  TournamentInsert,
  ClubTournament,
  SyncAction,
  SyncQueueItem,
} from '../types';

const DB_NAME = 'das_sportif.db';
let db: SQLite.SQLiteDatabase | null = null;

// ─── Bağlantı ────────────────────────────────────────────

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await db.execAsync('PRAGMA foreign_keys = ON;');
  }
  return db;
};

// ─── Init ─────────────────────────────────────────────────

export const initDatabase = async (): Promise<void> => {
  const database = await getDatabase();
  await database.execAsync(CREATE_CLUBS_TABLE);
  await database.execAsync(CREATE_TOURNAMENTS_TABLE);
  await database.execAsync(CREATE_CLUB_TOURNAMENT_TABLE);
  await database.execAsync(CREATE_SYNC_QUEUE_TABLE);
};

// ─── ID üreteci ───────────────────────────────────────────

const uid = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

// ═══════════════════════════════════════════════════════════
//  CLUBS
// ═══════════════════════════════════════════════════════════

export const insertClub = async (data: ClubInsert): Promise<Club> => {
  const database = await getDatabase();
  const id = uid('club');
  const createdAt = Date.now();
  const sql = `INSERT INTO clubs (id,name,city,district,lat,lng,notes,status,createdAt)
     VALUES (?,?,?,?,?,?,?,?,?)`;
  const params = [
    id,
    data.name,
    data.city,
    data.district,
    data.lat,
    data.lng,
    data.notes,
    data.status,
    createdAt,
  ];

  console.log('SQL Execute:', sql, params);

  await database.runAsync(sql, params);
  return { ...data, id, createdAt };
};

export const getAllClubs = async (): Promise<Club[]> => {
  const database = await getDatabase();
  const sql = 'SELECT * FROM clubs ORDER BY createdAt DESC';
  console.log('SQL Query:', sql);
  return database.getAllAsync<Club>(sql);
};

export const getClubById = async (id: string): Promise<Club | null> => {
  const database = await getDatabase();
  const sql = 'SELECT * FROM clubs WHERE id=?';
  console.log('SQL Query:', sql, [id]);
  return database.getFirstAsync<Club>(sql, [id]);
};

export const updateClub = async (id: string, data: Partial<ClubInsert>): Promise<void> => {
  const database = await getDatabase();
  const fields = Object.keys(data) as (keyof ClubInsert)[];
  if (!fields.length) return;
  const set = fields.map((f) => `${f}=?`).join(',');
  const vals = fields.map((f) => data[f] as string | number);

  const sql = `UPDATE clubs SET ${set} WHERE id=?`;
  console.log('SQL Execute:', sql, [...vals, id]);

  await database.runAsync(sql, [...vals, id]);
};

export const updateClubStatus = async (id: string, status: ClubStatus): Promise<void> => {
  const database = await getDatabase();
  const sql = 'UPDATE clubs SET status=? WHERE id=?';
  console.log('SQL Execute:', sql, [status, id]);
  await database.runAsync(sql, [status, id]);
};

export const deleteClub = async (id: string): Promise<void> => {
  const database = await getDatabase();
  const sql = 'DELETE FROM clubs WHERE id=?';
  console.log('SQL Execute:', sql, [id]);
  await database.runAsync(sql, [id]);
};

// ═══════════════════════════════════════════════════════════
//  TOURNAMENTS
// ═══════════════════════════════════════════════════════════

export const insertTournament = async (data: TournamentInsert): Promise<Tournament> => {
  const database = await getDatabase();
  const id = uid('trn');
  const createdAt = Date.now();
  const sql = `INSERT INTO tournaments (id,name,season,startDate,endDate,notes,createdAt)
     VALUES (?,?,?,?,?,?,?)`;
  const params = [id, data.name, data.season, data.startDate, data.endDate, data.notes, createdAt];

  console.log('SQL Execute:', sql, params);

  await database.runAsync(sql, params);
  return { ...data, id, createdAt };
};

export const getAllTournaments = async (): Promise<Tournament[]> => {
  const database = await getDatabase();
  const sql = 'SELECT * FROM tournaments ORDER BY createdAt DESC';
  console.log('SQL Query:', sql);
  return database.getAllAsync<Tournament>(sql);
};

export const getTournamentById = async (id: string): Promise<Tournament | null> => {
  const database = await getDatabase();
  const sql = 'SELECT * FROM tournaments WHERE id=?';
  console.log('SQL Query:', sql, [id]);
  return database.getFirstAsync<Tournament>(sql, [id]);
};

export const updateTournament = async (
  id: string,
  data: Partial<TournamentInsert>,
): Promise<void> => {
  const database = await getDatabase();
  const fields = Object.keys(data) as (keyof TournamentInsert)[];
  if (!fields.length) return;
  const set = fields.map((f) => `${f}=?`).join(',');
  const vals = fields.map((f) => data[f] as string | number | null);
  const sql = `UPDATE tournaments SET ${set} WHERE id=?`;
  console.log('SQL Execute:', sql, [...vals, id]);
  await database.runAsync(sql, [...vals, id]);
};

export const deleteTournament = async (id: string): Promise<void> => {
  const database = await getDatabase();
  const sql = 'DELETE FROM tournaments WHERE id=?';
  console.log('SQL Execute:', sql, [id]);
  await database.runAsync(sql, [id]);
};

// ═══════════════════════════════════════════════════════════
//  CLUB ↔ TOURNAMENT
// ═══════════════════════════════════════════════════════════

export const linkClubTournament = async (
  clubId: string,
  tournamentId: string,
): Promise<ClubTournament> => {
  const database = await getDatabase();
  const id = uid('ct');
  const sql = 'INSERT INTO club_tournament (id,clubId,tournamentId) VALUES (?,?,?)';
  console.log('SQL Execute:', sql, [id, clubId, tournamentId]);
  await database.runAsync(sql, [id, clubId, tournamentId]);
  return { id, clubId, tournamentId };
};

export const unlinkClubTournament = async (id: string): Promise<void> => {
  const database = await getDatabase();
  const sql = 'DELETE FROM club_tournament WHERE id=?';
  console.log('SQL Execute:', sql, [id]);
  await database.runAsync(sql, [id]);
};

export const getTournamentsByClub = async (clubId: string): Promise<Tournament[]> => {
  const database = await getDatabase();
  const sql = `SELECT t.* FROM tournaments t
     INNER JOIN club_tournament ct ON ct.tournamentId = t.id
     WHERE ct.clubId = ?
     ORDER BY t.createdAt DESC`;
  console.log('SQL Query:', sql, [clubId]);
  return database.getAllAsync<Tournament>(sql, [clubId]);
};

export const getClubsByTournament = async (tournamentId: string): Promise<Club[]> => {
  const database = await getDatabase();
  const sql = `SELECT c.* FROM clubs c
     INNER JOIN club_tournament ct ON ct.clubId = c.id
     WHERE ct.tournamentId = ?
     ORDER BY c.createdAt DESC`;
  console.log('SQL Query:', sql, [tournamentId]);
  return database.getAllAsync<Club>(sql, [tournamentId]);
};

export const getAllClubTournaments = async (): Promise<ClubTournament[]> => {
  const database = await getDatabase();
  return database.getAllAsync<ClubTournament>('SELECT * FROM club_tournament');
};

// ═══════════════════════════════════════════════════════════
//  SYNC QUEUE
// ═══════════════════════════════════════════════════════════

export const addToSyncQueue = async (
  tableName: string,
  recordId: string,
  action: SyncAction,
  payload?: object,
): Promise<void> => {
  const database = await getDatabase();
  const id = uid('sync');
  await database.runAsync(
    'INSERT INTO sync_queue (id,tableName,recordId,action,payload,createdAt,synced) VALUES (?,?,?,?,?,?,0)',
    [id, tableName, recordId, action, payload ? JSON.stringify(payload) : null, Date.now()],
  );
};

export const getPendingSyncItems = async (): Promise<SyncQueueItem[]> => {
  const database = await getDatabase();
  return database.getAllAsync<SyncQueueItem>(
    'SELECT * FROM sync_queue WHERE synced=0 ORDER BY createdAt ASC',
  );
};

export const markSynced = async (id: string): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('UPDATE sync_queue SET synced=1 WHERE id=?', [id]);
};

export const clearSyncedItems = async (): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM sync_queue WHERE synced=1');
};
