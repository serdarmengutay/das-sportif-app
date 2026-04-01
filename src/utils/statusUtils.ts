import { StatusBadgeConfig } from "../components/StatusBadge";
import { ClubStatus } from "../types";

/**
 * Kulüp durumlarına (status) göre badge (rozet) yapılandırmasını döndürür.
 * Tüm uygulama genelinde renk ve ikon uyumunu sağlar.
 */
export const getClubStatusConfig = (status: ClubStatus): StatusBadgeConfig => {
  switch (status) {
    case "deal":
      return {
        text: "Anlaşıldı",
        backgroundColor: "#a855f7", // Violet/Purple
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
        backgroundColor: "#22c55e", // Green
        color: "#ffffff",
        icon: "map-marker-check-outline",
      };
  }
};

/**
 * Dropdown ve seçim alanları için durum seçenekleri
 */
export const CLUB_STATUS_OPTIONS: { value: ClubStatus; label: string }[] = [
  { value: "visited", label: "Ziyaret" },
  { value: "proposal", label: "Teklif" },
  { value: "negotiation", label: "Görüşme" },
  { value: "deal", label: "Anlaşma" },
];
