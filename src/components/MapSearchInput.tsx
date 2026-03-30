import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { APP_COLORS } from "../styles/colors";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
};

export const MapSearchInput: React.FC<Props> = ({
  value,
  onChangeText,
  onFilterPress,
}) => (
  <View style={styles.container}>
    <View style={styles.inputWrapper}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder="Kulüp, şehir veya branş ara..."
        placeholderTextColor="#78909c"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
    </View>
    <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
      <Text style={styles.filterIcon}>☰</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: APP_COLORS.primary,
    paddingVertical: 0,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: APP_COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  filterIcon: {
    color: "#fff",
    fontSize: 20,
  },
});
