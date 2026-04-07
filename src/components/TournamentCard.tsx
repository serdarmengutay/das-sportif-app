import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBadge } from "./StatusBadge";
import { getTournamentStatusConfig } from "../utils/statusUtils";
import { formatDate } from "../utils/dateUtils";
import type { Tournament } from "../types";

interface TournamentCardProps {
  tournament: Tournament;
  onPress: (id: string) => void;
}

// dateUtils kullanılıyor.

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onPress,
}) => {
  const statusConfig = getTournamentStatusConfig(tournament.status);

  const startStr = tournament.startDate ? formatDate(tournament.startDate) : "";
  const endStr = tournament.endDate ? formatDate(tournament.endDate) : "";
  const dateText =
    startStr && endStr && startStr !== "Belirtilmedi"
      ? `${startStr} - ${endStr}`
      : startStr !== "Belirtilmedi" ? startStr : "Tarih Belirlenmedi";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      onPress={() => onPress(tournament.id)}
    >
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {tournament.name}
        </Text>
        <StatusBadge config={statusConfig} />
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="calendar-month-outline"
          size={14}
          color="#64748b"
        />
        <Text style={styles.infoText}>{dateText}</Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={14}
          color="#64748b"
        />
        <Text style={styles.infoText}>
          {tournament.city}, {tournament.locationName}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="soccer" size={14} color="#0f172a" />
        <Text style={styles.participantText}>
          {tournament.participantCount} Takım
        </Text>
      </View>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    flex: 1,
    marginRight: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 6,
  },
  participantText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
    marginLeft: 6,
  },
});
