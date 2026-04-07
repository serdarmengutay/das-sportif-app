import React, { useRef, useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import MapView, {
  Marker,
  LongPressEvent,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocation } from "../hooks/useLocation";
import { useClubStore } from "../store/useClubStore";
import { SCREENS, TABS } from "../constants/screenConstants";
import { MapSearchInput } from "../components/MapSearchInput";
import { ClubBottomSheet } from "../components/ClubBottomSheet";
import { AddClubBottomSheet } from "../components/AddClubBottomSheet";
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

export const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const mapRef = useRef<MapView>(null);
  const { coords, loading, error, refetch } = useLocation();
  const clubs = useClubStore((s) => s.clubs);
  const selectedClub = useClubStore((s) => s.selectedClub);
  const setSelectedClub = useClubStore((s) => s.setSelectedClub);
  
  const isFocused = useIsFocused();

  const addClubSheetRef = useRef<BottomSheetModal>(null);
  const clubDetailSheetRef = useRef<BottomSheetModal>(null);
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const route = useRoute<MapScreenProps["route"]>();
  const isSelectMode = route.params?.mode === 'select';
  const returnTo = route.params?.returnTo;

  // Arama → haritayı animate et
  const handleCitySelect = useCallback((city: { lat: number; lng: number }) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({ latitude: city.lat, longitude: city.lng, ...CITY_ZOOM }, 800);
    }
  }, []);

  // Marker tıklama → bottom sheet aç
  const handleMarkerPress = useCallback(
    (club: Club) => {
      setSelectedClub(club);
      clubDetailSheetRef.current?.present();
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          { latitude: club.lat, longitude: club.lng, ...CITY_ZOOM },
          500,
        );
      }
    },
    [setSelectedClub],
  );

  // Long press → AddClubModal veya Konum Seçimi
  const handleLongPress = useCallback(
    (e: LongPressEvent) => {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      if (isSelectMode) {
        setSelectedLocation({ lat: latitude, lng: longitude });
      } else {
        setPendingCoords({ lat: latitude, lng: longitude });
        addClubSheetRef.current?.present();
      }
    },
    [isSelectMode],
  );

  const handleConfirmLocation = useCallback(() => {
    if (selectedLocation && returnTo) {
      navigation.navigate(returnTo as any, {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      });
      setSelectedLocation(null);
    }
  }, [selectedLocation, returnTo, navigation]);

  // Bottom sheet kapatma
  const handleDismissSheet = useCallback(() => {
    setSelectedClub(null);
  }, [setSelectedClub]);

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
      {isFocused && <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />}
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
                onPress={() => !isSelectMode && handleMarkerPress(c)}
              />
            ))}

            {isSelectMode && selectedLocation && (
              <Marker
                coordinate={{
                  latitude: selectedLocation.lat,
                  longitude: selectedLocation.lng,
                }}
                pinColor={APP_COLORS.primary}
                title="Yeni Konum"
              />
            )}
          </MapView>

          {/* Search Overlay */}
          <MapSearchInput onCitySelect={handleCitySelect} />

          {/* FAB - Center to user */}
          <TouchableOpacity
            style={[styles.fab, isSelectMode && selectedLocation && { bottom: 100 }]}
            onPress={centerToUser}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 22 }}>📍</Text>
          </TouchableOpacity>

          {/* Confirm Button for Select Mode */}
          {isSelectMode && (
            <View style={styles.selectionOverlay}>
              <View style={styles.selectionCard}>
                <Text style={styles.selectionTitle}>
                  {selectedLocation ? "Konum Seçildi" : "Haritaya Uzun Basarak Konum Seçin"}
                </Text>
                {selectedLocation && (
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={handleConfirmLocation}
                  >
                    <Text style={styles.confirmBtnText}>Konumu Onayla</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.cancelSelectionBtn}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.cancelSelectionBtnText}>Vazgeç</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Club Count Badge */}
          {/* {clubs.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⚽ {clubs.length}</Text>
            </View>
          )} */}
        </View>
      </SafeView>
      {/* Bottom Sheets */}
      <ClubBottomSheet 
        ref={clubDetailSheetRef}
        club={selectedClub} 
        onDismiss={handleDismissSheet} 
      />
      <AddClubBottomSheet 
        ref={addClubSheetRef} 
        lat={pendingCoords?.lat || 0} 
        lng={pendingCoords?.lng || 0}
        onDismiss={() => setPendingCoords(null)}
      />
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
  selectionOverlay: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
  },
  selectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    gap: 12,
  },
  selectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
  },
  confirmBtn: {
    backgroundColor: APP_COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelSelectionBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelSelectionBtnText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },
});
