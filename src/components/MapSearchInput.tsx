import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { APP_COLORS } from "../styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TURKEY_CITIES } from "../utils/cities";

type Props = {
  onCitySelect: (city: { name: string; lat: number; lng: number }) => void;
};

export const MapSearchInput: React.FC<Props> = ({ onCitySelect }) => {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof TURKEY_CITIES>([]);

  const handleTextChange = (text: string) => {
    setValue(text);
    if (text.length > 0) {
      const filtered = TURKEY_CITIES.filter((c) =>
        c.name.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (city: typeof TURKEY_CITIES[0]) => {
    setValue(city.name);
    setShowSuggestions(false);
    onCitySelect(city);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <MaterialCommunityIcons
          style={styles.searchIcon}
          name="magnify"
          size={24}
          color={APP_COLORS.primary}
        />
        <TextInput
          style={styles.input}
          placeholder="Şehir Ara..."
          placeholderTextColor="#78909c"
          value={value}
          onChangeText={handleTextChange}
          returnKeyType="search"
          onFocus={() => {
             if (value.length > 0) setShowSuggestions(true);
          }}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => { setValue(""); setShowSuggestions(false); }}>
             <MaterialCommunityIcons name="close-circle" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.dropdown}>
          {suggestions.map((c) => (
            <TouchableOpacity 
               key={c.name} 
               style={styles.suggestionItem} 
               onPress={() => handleSelect(c)}
            >
              <MaterialCommunityIcons name="map-marker-outline" size={16} color="#64748b" />
              <Text style={styles.suggestionText}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  inputWrapper: {
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
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: APP_COLORS.primary,
    paddingVertical: 0,
    height: "100%",
  },
  dropdown: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 8,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
});
