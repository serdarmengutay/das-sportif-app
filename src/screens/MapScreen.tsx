import React, { useRef, useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, {
  Marker,
  LongPressEvent,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLocation } from "../hooks/useLocation";
import { useClubStore } from "../store/useClubStore";
import { SCREENS } from "../constants/screenConstants";
import { MapSearchInput } from "../components/MapSearchInput";
import { ClubBottomSheet } from "../components/ClubBottomSheet";
import { APP_COLORS } from "../styles/colors";
import type { MapScreenProps } from "../types/navigation";
import type { Club, ClubStatus } from "../types";
import SafeView from "../components/SafeView";

const DELTA = { latitudeDelta: 8.0, longitudeDelta: 12.0 };
const CITY_ZOOM = { latitudeDelta: 0.15, longitudeDelta: 0.15 };
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

// Basit şehir geocoding (mock)
const CITY_COORDS: Record<string, { latitude: number; longitude: number }> = {
  istanbul: { latitude: 41.0082, longitude: 28.9784 },
  ankara: { latitude: 39.9334, longitude: 32.8597 },
  izmir: { latitude: 38.4189, longitude: 27.1287 },
  antalya: { latitude: 36.8969, longitude: 30.7133 },
  bursa: { latitude: 40.1826, longitude: 29.0665 },
  adana: { latitude: 37.0, longitude: 35.3213 },
  konya: { latitude: 37.8746, longitude: 32.4932 },
  beşiktaş: { latitude: 41.0422, longitude: 29.0069 },
  kadıköy: { latitude: 40.9927, longitude: 29.0245 },
  trabzon: { latitude: 41.0027, longitude: 39.7168 },
};

export const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const mapRef = useRef<MapView>(null);
  const { coords, loading, error, refetch } = useLocation();
  const clubs = useClubStore((s) => s.clubs);
  const selectedClub = useClubStore((s) => s.selectedClub);
  const selectClub = useClubStore((s) => s.selectClub);

  const [searchText, setSearchText] = useState("");

  // Arama → haritayı animate et
  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    const key = text.toLowerCase().trim();
    const match = CITY_COORDS[key];
    if (match && mapRef.current) {
      mapRef.current.animateToRegion({ ...match, ...CITY_ZOOM }, 800);
    }
  }, []);

  // Marker tıklama → bottom sheet aç
  const handleMarkerPress = useCallback(
    (club: Club) => {
      selectClub(club);
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          { latitude: club.lat, longitude: club.lng, ...CITY_ZOOM },
          500,
        );
      }
    },
    [selectClub],
  );

  // Long press → AddClubModal
  const handleLongPress = useCallback(
    (e: LongPressEvent) => {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      navigation.navigate(SCREENS.ADD_CLUB_MODAL, {
        lat: latitude,
        lng: longitude,
      });
    },
    [navigation],
  );

  // Bottom sheet kapatma
  const handleDismissSheet = useCallback(() => {
    selectClub(null);
  }, [selectClub]);

  // Konuma geri dön
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
    <GestureHandlerRootView style={styles.container}>
      <SafeView>
        {/* Map */}
        <View style={styles.mapContainer}>
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
                pinColor={STATUS_COLORS[c.status]}
                onPress={() => handleMarkerPress(c)}
              />
            ))}
          </MapView>

          {/* Search Overlay */}
          <MapSearchInput value={searchText} onChangeText={handleSearch} />

          {/* FAB - Center to user */}
          <TouchableOpacity
            style={styles.fab}
            onPress={centerToUser}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 22 }}>📍</Text>
          </TouchableOpacity>

          {/* Club Count Badge */}
          {/* {clubs.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⚽ {clubs.length}</Text>
            </View>
          )} */}
        </View>
      </SafeView>
      {/* Bottom Sheet */}
      <ClubBottomSheet club={selectedClub} onDismiss={handleDismissSheet} />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.primary },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    backgroundColor: APP_COLORS.primary,
  },
  headerLogo: {
    fontSize: 18,
    fontWeight: "900",
    color: APP_COLORS.tertiary,
    letterSpacing: 1,
  },
  logoImage: {
    width: 100,
    height: 75,
    resizeMode: "contain",
  },
  headerSearchIcon: {
    fontSize: 20,
  },
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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
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
