import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { APP_COLORS } from "../styles/colors";

interface SummaryCardProps {
  total: number;
  deal: number;
  pending: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  total,
  deal,
  pending,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.value}>{total}</Text>
        <Text style={styles.title}>Toplam Kulüp</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.value}>{deal}</Text>
        <Text style={styles.title}>Anlaşılan</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.value}>{pending}</Text>
        <Text style={styles.title}>Bekleyen</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  card: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: APP_COLORS.primary,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  value: {
    fontSize: 36,
    fontWeight: "bold",
    color: APP_COLORS.tertiary,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: APP_COLORS.tertiary,
    fontWeight: "500",
    textAlign: "center",
  },
});
