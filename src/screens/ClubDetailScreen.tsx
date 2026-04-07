import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useClubStore } from "../store/useClubStore";
import { useTournamentStore } from "../store/useTournamentStore";
import { useClubTournamentStore } from "../store/useClubTournamentStore";
import { StatusBadge } from "../components/StatusBadge";
import { TournamentMiniCard } from "../components/TournamentMiniCard";
import { CopyToast } from "../components/CopyToast";
import { LinkTournamentBottomSheet } from "../components/LinkTournamentBottomSheet";
import { APP_COLORS } from "../styles/colors";
import { SCREENS } from "../constants/screenConstants";
import type { ClubDetailScreenProps } from "../types/navigation";

import { getClubStatusConfig } from "../utils/statusUtils";

export const ClubDetailScreen: React.FC<ClubDetailScreenProps> = () => {
  const navigation = useNavigation<ClubDetailScreenProps["navigation"]>();
  const route = useRoute<ClubDetailScreenProps["route"]>();
  const { clubId } = route.params;

  const { clubs } = useClubStore();
  const { tournaments } = useTournamentStore();
  const { relations, link } = useClubTournamentStore();

  const club = clubs.find((c) => c.id === clubId);

  // Toast State
  const [showToast, setShowToast] = useState(false);

  // Bottom Sheet Ref
  const linkModalRef = React.useRef<BottomSheetModal>(null);

  // Related tournaments (Reactive) - Refreshes instantly when store changes
  const relatedTournaments = useMemo(() => {
    if (!club) return [];
    const linkedIds = relations
      .filter((r) => r.clubId === clubId)
      .map((r) => r.tournamentId);
    return tournaments.filter((t) => linkedIds.includes(t.id));
  }, [club, relations, tournaments, clubId]);

  const handleTournamentPress = (tournamentId: string) => {
    navigation.push(SCREENS.TOURNAMENT_DETAIL, { tournamentId });
  };

  const handleOpenLinkModal = () => {
    linkModalRef.current?.present();
  };

  const handleLinkTournament = async (tournamentId: string) => {
    try {
      await link(clubId, tournamentId);
      Alert.alert("Başarılı", "Kulüp turnuvaya başarıyla bağlandı.");
    } catch (err) {
      console.warn("Bağlama hatası:", err);
      Alert.alert("Hata", "Kulüp turnuvaya bağlanırken bir sorun oluştu.");
    }
  };

  const handlePhonePress = useCallback(() => {
    if (!club?.coachPhone) return;
    Linking.openURL(`tel:${club.coachPhone}`);
  }, [club]);

  const handlePhoneLongPress = useCallback(async () => {
    if (!club?.coachPhone) return;
    await Clipboard.setStringAsync(club.coachPhone);
    setShowToast(true);
  }, [club]);

  const handleOpenMaps = useCallback(() => {
    if (!club) return;
    const { lat, lng } = club;
    const url =
      Platform.OS === "android"
        ? `geo:${lat},${lng}?q=${lat},${lng}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  }, [club]);

  if (!club) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredError}>
          <Text style={styles.errorText}>Kulüp bulunamadı.</Text>
          <TouchableOpacity
            style={styles.backBtnFallback}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnFallbackText}>Geri</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = getClubStatusConfig(club.status);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <CopyToast visible={showToast} onHide={() => setShowToast(false)} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#0f172a"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Kulüp Detayı</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREENS.CLUB_EDIT, { clubId })}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={22}
                color="#0f172a"
              />
            </TouchableOpacity>
          </View>

          {/* Club Info Section */}
          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <Text style={styles.clubName}>{club.name}</Text>
              <StatusBadge config={statusConfig} />
            </View>
          </View>

          {/* Notes Card */}
          {club.notes ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Notlar</Text>
              <View style={styles.divider} />
              <Text style={styles.cardContent}>{club.notes}</Text>
            </View>
          ) : null}

          {/* Phone Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Telefon Numarası</Text>
            <View style={styles.divider} />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePhonePress}
              onLongPress={handlePhoneLongPress}
              style={styles.phoneRow}
            >
              <MaterialCommunityIcons
                name="phone-outline"
                size={18}
                color={APP_COLORS.primary}
              />
              <Text style={styles.phoneText}>{club.coachPhone || "-"}</Text>
            </TouchableOpacity>
          </View>

          {/* Club Responsible Card */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { color: APP_COLORS.primary }]}>
              Kulüp Sorumlusu
            </Text>
            <View style={styles.divider} />
            <View style={styles.responsibleRow}>
              <MaterialCommunityIcons
                name="account-outline"
                size={18}
                color="#0f172a"
              />
              <Text style={styles.responsibleText}>{club.coachName || "-"}</Text>
            </View>
          </View>

          {/* Related Tournaments Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>İlişkili Turnuvalar</Text>
            <TouchableOpacity
              onPress={handleOpenLinkModal}
              style={styles.addTournamentChip}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="plus"
                size={16}
                color={APP_COLORS.primary}
              />
              <Text style={styles.addTournamentChipText}>Turnuva Ekle</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tournamentListWrapper}>
            {relatedTournaments.length > 0 ? (
              relatedTournaments.map((t) => (
                <TournamentMiniCard
                  key={t.id}
                  tournament={t}
                  onPress={handleTournamentPress}
                />
              ))
            ) : (
              <TouchableOpacity
                style={styles.emptyRelationCard}
                onPress={handleOpenLinkModal}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="trophy-outline"
                  size={32}
                  color="#cbd5e1"
                />
                <Text style={styles.emptyText}>
                  Henüz bir turnuva ile ilişkilendirilmemiş.
                </Text>
                <Text style={styles.emptyActionText}>Atamak için tıklayın</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Location Unified Card */}
          {club.lat !== 0 && club.lng !== 0 ? (
            <View style={styles.sectionWrapper}>
              <Text style={styles.sectionTitle}>Konum</Text>
              <View style={styles.locationUnifiedCard}>
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.miniMap}
                    provider={
                      Platform.OS === "android" ? PROVIDER_GOOGLE : undefined
                    }
                    initialRegion={{
                      latitude: club.lat,
                      longitude: club.lng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                  >
                    <Marker
                      coordinate={{
                        latitude: club.lat,
                        longitude: club.lng,
                      }}
                    />
                  </MapView>
                </View>

                <View style={styles.locationFooter}>
                  <View style={styles.locationAddressRow}>
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={16}
                      color="#64748b"
                    />
                    <Text style={styles.locationText}>
                      {club.district ? `${club.district}, ` : ""}
                      {club.city}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.openMapsBtn}
                    onPress={handleOpenMaps}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name="google-maps"
                      size={18}
                      color="#ffffff"
                    />
                    <Text style={styles.openMapsBtnText}>Haritalar'da Aç</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>

        <LinkTournamentBottomSheet
          ref={linkModalRef}
          clubId={clubId}
          onLink={handleLinkTournament}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_COLORS.light_bg,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centeredError: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 16,
  },
  backBtnFallback: {
    padding: 12,
  },
  backBtnFallbackText: {
    color: APP_COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0f172a",
  },
  nameSection: {
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  clubName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
    flex: 1,
    marginRight: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: APP_COLORS.secondary,
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 14,
    color: "#1e293b",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 12,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneText: {
    fontSize: 15,
    fontWeight: "600",
    color: APP_COLORS.primary,
    marginLeft: 8,
  },
  responsibleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  responsibleText: {
    fontSize: 14,
    color: "#0f172a",
    marginLeft: 8,
  },
  sectionWrapper: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 2,
  },
  addTournamentChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  addTournamentChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: APP_COLORS.primary,
  },
  tournamentListWrapper: {
    marginBottom: 12,
  },
  emptyRelationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
  },
  emptyActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: APP_COLORS.primary,
    marginTop: 8,
  },
  locationUnifiedCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  mapContainer: {
    height: 180,
    borderRadius: 15,
    overflow: "hidden",
  },
  miniMap: {
    flex: 1,
  },
  locationFooter: {
    marginTop: 12,
    gap: 12,
  },
  locationAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  locationText: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 6,
  },
  openMapsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: APP_COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  openMapsBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
