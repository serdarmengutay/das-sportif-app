import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Club, Tournament, ClubTournament } from "../types";

// Helper to remove undefined values before sending to Firestore
const stripUndefined = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

// CLUBS

export const createClubRemote = async (club: Club) => {
  await setDoc(doc(db, "clubs", club.id), stripUndefined(club));
};

export const getClubsRemote = async (): Promise<Club[]> => {
  const snapshot = await getDocs(collection(db, "clubs"));
  return snapshot.docs.map((doc) => doc.data() as Club);
};

export const updateClubRemote = async (id: string, data: Partial<Club>) => {
  await updateDoc(doc(db, "clubs", id), stripUndefined(data));
};

export const deleteClubRemote = async (id: string) => {
  await deleteDoc(doc(db, "clubs", id));
};

// TOURNAMENTS

export const createTournamentRemote = async (tournament: Tournament) => {
  await setDoc(doc(db, "tournaments", tournament.id), stripUndefined(tournament));
};

export const getTournamentsRemote = async (): Promise<Tournament[]> => {
  const snapshot = await getDocs(collection(db, "tournaments"));
  return snapshot.docs.map((doc) => doc.data() as Tournament);
};

export const updateTournamentRemote = async (id: string, data: Partial<Tournament>) => {
  await updateDoc(doc(db, "tournaments", id), stripUndefined(data));
};

export const deleteTournamentRemote = async (id: string) => {
  await deleteDoc(doc(db, "tournaments", id));
};

// RELATIONS (CLUB_TOURNAMENT)

export const linkClubTournamentRemote = async (relation: ClubTournament) => {
  await setDoc(doc(db, "club_tournament", relation.id), relation);
};

export const unlinkClubTournamentRemote = async (id: string) => {
  await deleteDoc(doc(db, "club_tournament", id));
};

export const getClubTournamentsRemote = async (): Promise<ClubTournament[]> => {
  const snapshot = await getDocs(collection(db, "club_tournament"));
  return snapshot.docs.map((doc) => doc.data() as ClubTournament);
};

