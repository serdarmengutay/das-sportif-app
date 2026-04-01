import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useClubStore } from "../store/useClubStore";
import { useTournamentStore } from "../store/useTournamentStore";
import { useClubTournamentStore } from "../store/useClubTournamentStore";
import { StatusBadge, type StatusBadgeConfig } from "../components/StatusBadge";
import { TournamentMiniCard } from "../components/TournamentMiniCard";
import { CopyToast } from "../components/CopyToast";
import { APP_COLORS } from "../styles/colors";
import { SCREENS } from "../constants/screenConstants";
import type { ClubDetailScreenProps } from "../types/navigation";
import type { ClubStatus, Tournament } from "../types";

import { getClubStatusConfig } from "../utils/statusUtils";

export const ClubDetailScreen: React.FC<ClubDetailScreenProps> = () => {
  const navigation = useNavigation<ClubDetailScreenProps["navigation"]>();
  const route = useRoute<ClubDetailScreenProps["route"]>();
  const { clubId } = route.params;

  const { clubs, updateClub } = useClubStore();
  const { tournaments } = useTournamentStore();
  const { getTournamentIds } = useClubTournamentStore();

  const club = clubs.find((c) => c.id === clubId);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<ClubStatus>("proposal");
  const [notes, setNotes] = useState("");
  const [coachPhone, setCoachPhone] = useState("");
  const [coachName, setCoachName] = useState("");

  // Toast
  const [showToast, setShowToast] = useState(false);

  // Related tournaments
  const [relatedTournaments, setRelatedTournaments] = useState<Tournament[]>(
    [],
  );

  useEffect(() => {
    if (club) {
      setStatus(club.status);
      setNotes(club.notes || "");
      setCoachPhone(club.coachPhone || "");
      setCoachName(club.coachName || "");
    }
  }, [club]);

  useEffect(() => {
    if (club) {
      const ids = getTournamentIds(club.id);
      const rt = tournaments.filter((t) => ids.includes(t.id));
      setRelatedTournaments(rt);
    }
  }, [club, getTournamentIds, tournaments]);

  const handleSave = useCallback(async () => {
    if (!club) return;
    await updateClub(club.id, { status, notes, coachPhone, coachName });
    setIsEditing(false);
  }, [club, updateClub, status, notes, coachPhone, coachName]);

  const handleCancel = useCallback(() => {
    if (club) {
      setStatus(club.status);
      setNotes(club.notes || "");
      setCoachPhone(club.coachPhone || "");
      setCoachName(club.coachName || "");
    }
    setIsEditing(false);
  }, [club]);

  const handleTournamentPress = (tournamentId: string) => {
    navigation.push(SCREENS.TOURNAMENT_DETAIL, { tournamentId });
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

  // ── Not Found ───────────────────────────────────────────
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

  // ── Edit Mode ───────────────────────────────────────────
  if (isEditing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={handleCancel}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#0f172a"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Düzenle</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.clubName}>{club.name}</Text>

          {/* Status */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>DURUM</Text>
            <View style={styles.statusRow}>
              {(
                ["visited", "proposal", "negotiation", "deal"] as ClubStatus[]
              ).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusBtn,
                    status === s && styles.statusBtnActive,
                  ]}
                  onPress={() => setStatus(s)}
                >
                  <Text
                    style={[
                      styles.statusBtnText,
                      status === s && styles.statusBtnTextActive,
                    ]}
                  >
                    {s === "visited"
                      ? "ZİYARET"
                      : s === "proposal"
                        ? "TEKLİF"
                        : s === "negotiation"
                          ? "GÖRÜŞME"
                          : "ANLAŞMA"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Phone */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>ANTRENÖR TELEFONU</Text>
            <TextInput
              style={styles.input}
              value={coachPhone}
              onChangeText={setCoachPhone}
              placeholder="Örn: 0555 555 5555"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
            />
          </View>

          {/* Coach Name */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>KULÜP SORUMLUSU</Text>
            <TextInput
              style={styles.input}
              value={coachName}
              onChangeText={setCoachName}
              placeholder="Ad Soyad"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Notes */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>GÖRÜŞME NOTLARI</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Notlarınızı buraya ekleyebilirsiniz..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Actions */}
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
            >
              <Text style={styles.cancelBtnText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── View Mode ───────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <CopyToast
        visible={showToast}
        onHide={() => setShowToast(false)}
      />

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
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={22}
              color="#0f172a"
            />
          </TouchableOpacity>
        </View>

        {/* Club Name + Status + Location */}
        <View style={styles.nameSection}>
          <View style={styles.nameRow}>
            <Text style={styles.clubName}>{club.name}</Text>
            <StatusBadge config={statusConfig} />
          </View>
          <View style={styles.locationRow}>
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
        </View>

        {/* Notes Card */}
        {club.notes ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notlar</Text>
            <View style={styles.divider} />
            <Text style={styles.cardContent}>{club.notes}</Text>
          </View>
        ) : null}

        {/* Phone Section */}
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
            <Text style={styles.phoneText}>
              {club.coachPhone || "-"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Club Responsible */}
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

        {/* Related Tournaments */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>İlişkili Turnuvalar</Text>
          {relatedTournaments.length > 0 ? (
            relatedTournaments.map((t) => (
              <TournamentMiniCard
                key={t.id}
                tournament={t}
                onPress={handleTournamentPress}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              Henüz bir turnuva ile ilişkilendirilmemiş.
            </Text>
          )}
        </View>

        {/* Mini Map */}
        {club.lat !== 0 && club.lng !== 0 ? (
          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>Konum</Text>
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
        ) : null}
      </ScrollView>
    </SafeAreaView>
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

  // ── Header ──────────────────────────────────────────────
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

  // ── Name Section ────────────────────────────────────────
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
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 4,
  },

  // ── Card ────────────────────────────────────────────────
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
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 8,
    letterSpacing: 0.5,
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

  // ── Phone ───────────────────────────────────────────────
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

  // ── Responsible ─────────────────────────────────────────
  responsibleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  responsibleText: {
    fontSize: 14,
    color: "#0f172a",
    marginLeft: 8,
  },

  // ── Section ─────────────────────────────────────────────
  sectionWrapper: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: "#94a3b8",
  },

  // ── Mini Map ────────────────────────────────────────────
  mapContainer: {
    height: 180,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 12,
  },
  miniMap: {
    flex: 1,
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

  // ── Edit Mode ───────────────────────────────────────────
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "transparent",
  },
  statusBtnActive: {
    backgroundColor: "#e0f2fe",
    borderColor: "#38bdf8",
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
  statusBtnTextActive: {
    color: "#0284c7",
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#e2e8f0",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#1e293b",
    fontSize: 14,
    fontWeight: "700",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: APP_COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
