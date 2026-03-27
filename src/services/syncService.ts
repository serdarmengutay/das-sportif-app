import {
  createClubRemote,
  deleteClubRemote,
  updateClubRemote,
  createTournamentRemote,
  deleteTournamentRemote,
  updateTournamentRemote,
} from "./firestoreService";
import { getPendingSyncItems, markSynced } from "./database";

export const syncData = async () => {
  try {
    const queue = await getPendingSyncItems();

    for (const item of queue) {
      try {
        const payload = item.payload ? JSON.parse(item.payload) : null;

        // CLUBS
        if (item.tableName === "clubs") {
          if (item.action === "insert" && payload) {
            await createClubRemote(payload);
          } else if (item.action === "update" && payload) {
            await updateClubRemote(item.recordId, payload);
          } else if (item.action === "delete") {
            await deleteClubRemote(item.recordId);
          }
        }

        // TOURNAMENTS
        if (item.tableName === "tournaments") {
          if (item.action === "insert" && payload) {
            await createTournamentRemote(payload);
          } else if (item.action === "update" && payload) {
            await updateTournamentRemote(item.recordId, payload);
          } else if (item.action === "delete") {
            await deleteTournamentRemote(item.recordId);
          }
        }

        // Başarılı olursa işaretle
        await markSynced(item.id);
      } catch (e) {
        console.warn(`Sync error for item ${item.id}:`, e);
      }
    }
  } catch (error) {
    console.error("Failed to fetch sync queue:", error);
  }
};
