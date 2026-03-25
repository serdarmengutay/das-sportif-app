import React, { useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, {
  Marker,
  LongPressEvent,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { useLocation } from "../hooks/useLocation";
import { useClubs } from "../hooks/useClubs";
import type { ClubStatus } from "../types";

const DELTA = { latitudeDelta: 8.0, longitudeDelta: 12.0 };
const DEFAULT_REGION = { latitude: 39.0, longitude: 35.0, ...DELTA };

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const STATUS_COLORS: Record<ClubStatus, string> = {
  visited: "#66bb6a",
  proposal: "#ffa726",
  negotiation: "#42a5f5",
  deal: "#ab47bc",
};

export const MapScreen: React.FC = () => {
  const mapRef = useRef<MapView>(null);
  const { coords, loading, error, refetch } = useLocation();
  const { clubs, addClub } = useClubs();

  const handleLongPress = useCallback(
    (e: LongPressEvent) => {
      const { latitude, longitude } = e.nativeEvent.coordinate;

      if (Platform.OS === "ios") {
        Alert.prompt(
          "Yeni Kulüp",
          "Kulüp adını girin:",
          [
            { text: "İptal", style: "cancel" },
            {
              text: "Kaydet",
              onPress: (name?: string) => {
                if (!name?.trim()) return;
                addClub({
                  name: name.trim(),
                  city: "",
                  district: "",
                  lat: latitude,
                  lng: longitude,
                  notes: "",
                  status: "visited",
                });
              },
            },
          ],
          "plain-text",
        );
      } else {
        Alert.alert("Yeni Kulüp", "Bu konuma kulüp eklensin mi?", [
          { text: "İptal", style: "cancel" },
          {
            text: "Ekle",
            onPress: () =>
              addClub({
                name: `Kulüp ${clubs.length + 1}`,
                city: "",
                district: "",
                lat: latitude,
                lng: longitude,
                notes: "",
                status: "visited",
              }),
          },
        ]);
      }
    },
    [addClub, clubs.length],
  );

  const centerToUser = useCallback(() => {
    if (!coords || !mapRef.current) return;
    mapRef.current.animateToRegion({ ...coords, ...DELTA }, 600);
  }, [coords]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4fc3f7" />
        <Text style={styles.info}>Konum alınıyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>⚠️ {error}</Text>
        <TouchableOpacity style={styles.btn} onPress={refetch}>
          <Text style={styles.btnText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={coords ? { ...coords, ...DELTA } : DEFAULT_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        onLongPress={handleLongPress}
        mapType="standard"
        customMapStyle={DARK_MAP_STYLE}
      >
        {clubs.map((c) => (
          <Marker
            key={c.id}
            coordinate={{ latitude: c.lat, longitude: c.lng }}
            title={c.name}
            pinColor={STATUS_COLORS[c.status]}
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.fab}
        onPress={centerToUser}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 22 }}>📍</Text>
      </TouchableOpacity>

      {clubs.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⚽ {clubs.length}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    gap: 12,
  },
  info: { color: "#b0bec5", fontSize: 16 },
  error: {
    color: "#ef5350",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  btn: {
    backgroundColor: "#4fc3f7",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 32,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  badge: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
    backgroundColor: "rgba(26,26,46,0.85)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: { color: "#e0e0e0", fontSize: 13, fontWeight: "600" },
});
