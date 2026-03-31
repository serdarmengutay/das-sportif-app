import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBadge, type StatusBadgeConfig } from "./StatusBadge";
import type { Tournament, TournamentStatus } from "../types";

interface TournamentMiniCardProps {
  tournament: Tournament;
  onPress: (id: string) => void;
}

const getStatusConfig = (status: TournamentStatus): StatusBadgeConfig => {
  switch (status) {
    case "active":
      return {
        text: "Devam Ediyor",
        backgroundColor: "#22c55e",
        color: "#ffffff",
        icon: "play-circle",
      };
    case "completed":
      return {
        text: "Tamamlandı",
        backgroundColor: "#a855f7",
        color: "#ffffff",
        icon: "check-circle",
      };
    case "planned":
    default:
      return {
        text: "Planlandı",
        backgroundColor: "#f97316",
        color: "#ffffff",
        icon: "clock-outline",
      };
  }
};

const formatDate = (timestamp: number | null) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
  });
};

export const TournamentMiniCard: React.FC<TournamentMiniCardProps> = ({
  tournament,
  onPress,
}) => {
  const statusConfig = getStatusConfig(tournament.status);
  const startStr = formatDate(tournament.startDate);
  const endStr = formatDate(tournament.endDate);
  const dateText =
    startStr && endStr ? `${startStr} – ${endStr}` : startStr || endStr || "—";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      onPress={() => onPress(tournament.id)}
    >
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>
          {tournament.name}
        </Text>
        <StatusBadge config={statusConfig} />
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="calendar-month-outline"
          size={13}
          color="#64748b"
        />
        <Text style={styles.infoText}>{dateText}</Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={13}
          color="#64748b"
        />
        <Text style={styles.infoText}>
          {tournament.city}, {tournament.locationName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    flex: 1,
    marginRight: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 5,
  },
});
