import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type MDIconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export interface StatusBadgeConfig {
  text: string;
  backgroundColor: string;
  color: string;
  icon: MDIconName;
}

interface StatusBadgeProps {
  config: StatusBadgeConfig;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ config }) => {
  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <MaterialCommunityIcons
        name={config.icon}
        size={14}
        color={config.color}
      />
      <Text style={[styles.text, { color: config.color }]}>
        {config.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 10,
    fontWeight: "600",
  },
});
