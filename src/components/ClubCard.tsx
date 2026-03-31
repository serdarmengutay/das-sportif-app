import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBadge, type StatusBadgeConfig } from "./StatusBadge";
import type { Club, ClubStatus } from "../types";

interface ClubCardProps {
  club: Club;
  onPress: (id: string) => void;
}

const getStatusConfig = (status: ClubStatus): StatusBadgeConfig => {
  switch (status) {
    case "deal":
      return {
        text: "Anlaşıldı",
        backgroundColor: "#a855f7",
        color: "#ffffff",
        icon: "handshake",
      };
    case "negotiation":
      return {
        text: "Görüşülüyor",
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        icon: "chat-processing-outline",
      };
    case "proposal":
      return {
        text: "Teklif",
        backgroundColor: "#f97316",
        color: "#ffffff",
        icon: "file-document-edit-outline",
      };
    case "visited":
    default:
      return {
        text: "Ziyaret Edildi",
        backgroundColor: "#22c55e",
        color: "#ffffff",
        icon: "map-marker-check-outline",
      };
  }
};

export const ClubCard: React.FC<ClubCardProps> = ({ club, onPress }) => {
  const statusConfig = getStatusConfig(club.status);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      onPress={() => onPress(club.id)}
    >
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {club.name}
        </Text>
        <StatusBadge config={statusConfig} />
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location-sharp" size={14} color="#64748b" />
        <Text style={styles.locationText}>
          {club.city}, {club.district}
        </Text>
      </View>

      {club.notes ? (
        <Text style={styles.notes} numberOfLines={3} ellipsizeMode="tail">
          {club.notes}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    flex: 1,
    marginRight: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 4,
  },
  notes: {
    fontSize: 14,
    fontWeight: "400",
    color: "#475569",
    marginTop: 12,
  },
});
