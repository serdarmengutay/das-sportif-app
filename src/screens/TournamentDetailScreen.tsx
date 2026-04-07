import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTournamentStore } from "../store/useTournamentStore";
import { useClubTournamentStore } from "../store/useClubTournamentStore";
import { useClubStore } from "../store/useClubStore";
import { StatusBadge } from "../components/StatusBadge";
import { getTournamentStatusConfig } from "../utils/statusUtils";
import { TournamentClubCard } from "../components/TournamentClubCard";
import { LinkClubBottomSheet } from "../components/LinkClubBottomSheet";
import { TournamentBottomSheet } from "../components/TournamentBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { APP_COLORS } from "../styles/colors";
import { SCREENS } from "../constants/screenConstants";
import { formatDate } from "../utils/dateUtils";
import type { TournamentDetailScreenProps } from "../types/navigation";
import type { Club, TournamentStatus } from "../types";
import SafeView from "../components/SafeView";

// ── Status Config ──────────────────────────────────────────

// getTournamentStatusConfig statusUtils'ten alınıyor.

// ── Date Formatter ──────────────────────────────────────────

// formatDate utils/dateUtils.ts'den alınıyor.

// ── Screen ──────────────────────────────────────────────────

export const TournamentDetailScreen: React.FC<
  TournamentDetailScreenProps
> = () => {
  const navigation = useNavigation<TournamentDetailScreenProps["navigation"]>();
  const route = useRoute<TournamentDetailScreenProps["route"]>();
  const { tournamentId } = route.params;

  const tournament = useTournamentStore((s) =>
    s.tournaments.find((t) => t.id === tournamentId),
  );
  const removeTournament = useTournamentStore((s) => s.removeTournament);
  const clubs = useClubStore((s) => s.clubs);

  // ── Reactive Relation Selection ──
  const relations = useClubTournamentStore((s) => s.relations);
  const { link } = useClubTournamentStore();

  const relatedClubs = useMemo(() => {
    const ids = relations
      .filter((r) => r.tournamentId === tournamentId)
      .map((r) => r.clubId);
    return clubs.filter((c) => ids.includes(c.id));
  }, [relations, tournamentId, clubs]);

  const [isEditing, setIsEditing] = useState(false);
  const linkSheetRef = React.useRef<BottomSheetModal>(null);

  // ── Handlers ──

  const handleDelete = useCallback(() => {
    if (!tournament) return;
    Alert.alert("Turnuvayı Sil", `"${tournament.name}" silinsin mi?`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          await removeTournament(tournamentId);
          navigation.goBack();
        },
      },
    ]);
  }, [tournament, tournamentId, removeTournament, navigation]);

  const handleLinkClub = useCallback(() => {
    linkSheetRef.current?.present();
  }, []);

  const handleLinkPress = async (clubId: string) => {
    try {
      await link(clubId, tournamentId);
    } catch (err) {
      Alert.alert("Hata", "Kulüp bağlanırken bir sorun oluştu.");
    }
  };

  const handleClubPress = (clubId: string) => {
    navigation.navigate(SCREENS.CLUB_DETAIL, { clubId });
  };

  // ── Not Found ──

  if (!tournament) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredError}>
          <Text style={styles.errorText}>Turnuva bulunamadı.</Text>
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

  const statusConfig = getTournamentStatusConfig(tournament.status);

  // ── View Mode ──

  return (
    <SafeView style={styles.safeArea}>
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
          <Text style={styles.headerTitle}>Turnuva Detayı</Text>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.TOURNAMENT_EDIT, { tournamentId })}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={22}
              color="#0f172a"
            />
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.tournamentName}>{tournament.name}</Text>
            <StatusBadge config={statusConfig} />
          </View>
          <View style={styles.locationRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={16}
              color="#64748b"
            />
            <Text style={styles.locationText}>
              {tournament.city}
              {tournament.locationName ? ` · ${tournament.locationName}` : ""}
            </Text>
          </View>
        </View>

        {/* Date Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tarih Bilgisi</Text>
          <View style={styles.divider} />
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <MaterialCommunityIcons
                name="calendar-start"
                size={16}
                color={APP_COLORS.secondary}
              />
              <View style={styles.dateTexts}>
                <Text style={styles.dateLabel}>Başlangıç</Text>
                <Text style={styles.dateValue}>
                  {formatDate(tournament.startDate)}
                </Text>
              </View>
            </View>
            <View style={styles.dateSpacer} />
            <View style={styles.dateItem}>
              <MaterialCommunityIcons
                name="calendar-end"
                size={16}
                color={APP_COLORS.secondary}
              />
              <View style={styles.dateTexts}>
                <Text style={styles.dateLabel}>Bitiş</Text>
                <Text style={styles.dateValue}>
                  {formatDate(tournament.endDate)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notes Card */}
        {tournament.locationName ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lokasyon</Text>
            <View style={styles.divider} />
            <View style={styles.locationInfoRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={18}
                color={APP_COLORS.primary}
              />
              <Text style={styles.cardContent}>
                {tournament.locationName}, {tournament.city}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Participating Clubs */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Katılan Kulüpler</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {relatedClubs.length} Takım
              </Text>
            </View>
          </View>

          {relatedClubs.length > 0 ? (
            relatedClubs.map((club: Club) => (
              <TournamentClubCard
                key={club.id}
                club={club}
                onPress={handleClubPress}
              />
            ))
          ) : (
            <View style={styles.emptyClubContainer}>
              <MaterialCommunityIcons
                name="account-group-outline"
                size={32}
                color="#cbd5e1"
              />
              <Text style={styles.emptyText}>Henüz bir kulüp katılmamış.</Text>
            </View>
          )}

          {/* Link Club Button */}
          <TouchableOpacity
            style={styles.linkClubBtn}
            onPress={handleLinkClub}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="plus"
              size={18}
              color={APP_COLORS.secondary}
            />
            <Text style={styles.linkClubText}>Kulüp Bağla</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={18}
            color="#EF4444"
          />
          <Text style={styles.deleteBtnText}>Turnuvayı Sil</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Link Club Modal */}
      <LinkClubBottomSheet
        ref={linkSheetRef}
        tournamentId={tournamentId}
        onLink={handleLinkPress}
      />
    </SafeView>
  );
};

// ── Styles ──────────────────────────────────────────────────

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

  // ── Header ──
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

  // ── Title Section ──
  titleSection: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  tournamentName: {
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

  // ── Card ──
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
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 12,
  },

  // ── Date ──
  dateRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  dateItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  dateSpacer: {
    width: 12,
  },
  dateTexts: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },

  // ── Location Info ──
  locationInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ── Section ──
  sectionWrapper: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  countBadge: {
    backgroundColor: `${APP_COLORS.secondary}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: APP_COLORS.secondary,
  },
  emptyClubContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 32,
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: "#94a3b8",
  },

  // ── Link Club Button ──
  linkClubBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: APP_COLORS.secondary,
    borderStyle: "dashed",
    gap: 6,
  },
  linkClubText: {
    fontSize: 14,
    fontWeight: "600",
    color: APP_COLORS.secondary,
  },

  // ── Delete ──
  deleteBtn: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 6,
  },
  deleteBtnText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
  },
});
