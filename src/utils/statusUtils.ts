import { StatusBadgeConfig } from "../components/StatusBadge";
import { ClubStatus, TournamentStatus } from "../types";

/**
 * Kulüp durumlarına (status) göre badge (rozet) yapılandırması.
 */
export const getClubStatusConfig = (status: ClubStatus): StatusBadgeConfig => {
  switch (status) {
    case "deal":
      return {
        text: "Anlaşıldı",
        backgroundColor: "#22c55e", // Green
        color: "#ffffff",
        icon: "handshake",
      };
    case "negotiation":
      return {
        text: "Görüşülüyor",
        backgroundColor: "#3b82f6", // Blue
        color: "#ffffff",
        icon: "chat-processing-outline",
      };
    case "proposal":
      return {
        text: "Teklif",
        backgroundColor: "#f97316", // Orange
        color: "#ffffff",
        icon: "file-document-edit-outline",
      };
    case "visited":
    default:
      return {
        text: "Ziyaret Edildi",
        backgroundColor: "#64748b", // Slate
        color: "#ffffff",
        icon: "map-marker-check-outline",
      };
  }
};

/**
 * Turnuva durumlarına (status) göre badge (rozet) yapılandırması.
 */
export const getTournamentStatusConfig = (status: TournamentStatus): StatusBadgeConfig => {
  switch (status) {
    case "active":
      return {
        text: "Aktif",
        backgroundColor: "#3b82f6", // Blue
        color: "#ffffff",
        icon: "play-circle-outline",
      };
    case "completed":
      return {
        text: "Tamamlandı",
        backgroundColor: "#10b981", // Emerald
        color: "#ffffff",
        icon: "check-circle-outline",
      };
    case "planned":
    default:
      return {
        text: "Planlandı",
        backgroundColor: "#64748b", // Slate
        color: "#ffffff",
        icon: "calendar-clock",
      };
  }
};

/**
 * Seçim alanları için durum seçenekleri
 */
export const CLUB_STATUS_OPTIONS: { value: ClubStatus; label: string }[] = [
  { value: "visited", label: "Ziyaret Edildi" },
  { value: "negotiation", label: "Görüşülüyor" },
  { value: "proposal", label: "Teklif" },
  { value: "deal", label: "Anlaşıldı" },
];

export const TOURNAMENT_STATUS_OPTIONS: { value: TournamentStatus; label: string }[] = [
  { value: "planned", label: "Planlandı" },
  { value: "active", label: "Aktif" },
  { value: "completed", label: "Tamamlandı" },
];
