import React, { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { APP_COLORS } from "../styles/colors";
import { StatusBadge, type StatusBadgeConfig } from "./StatusBadge";
import { SCREENS } from "../constants/screenConstants";
import { useAppNavigation } from "../hooks/useGlobal/useAppNavigation";
import type { Club, ClubStatus } from "../types";

// ── Status Config ──────────────────────────────────────────

import { getClubStatusConfig } from "../utils/statusUtils";

type Props = {
  club: Club | null;
  onDismiss: () => void;
};

export const ClubBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ club, onDismiss }, ref) => {
    const navigation = useAppNavigation();
    const snapPoints = useMemo(() => ["45%", "60%"], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    const handleViewDetails = useCallback(() => {
      if (!club) return;
      // Close modal first
      if (typeof ref !== "function" && ref?.current) {
        ref.current.dismiss();
      }
      navigation.navigate(SCREENS.CLUB_DETAIL, { clubId: club.id });
    }, [club, navigation, ref]);

    if (!club) return null;

    const statusConfig = getClubStatusConfig(club.status);

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onDismiss={onDismiss}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetView style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.titleGroup}>
              <Text style={styles.clubName} numberOfLines={1}>
                {club.name}
              </Text>
              <View style={styles.locationRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={14}
                  color="#64748b"
                />
                <Text style={styles.locationText} numberOfLines={1}>
                  {club.district ? `${club.district}, ` : ""}
                  {club.city}
                </Text>
              </View>
            </View>
            <StatusBadge config={statusConfig} />
          </View>

          <View style={styles.divider} />

          {/* Info Section */}
          <View style={styles.infoSection}>
            {/* Coach Info */}
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name="account-tie"
                  size={20}
                  color={APP_COLORS.primary}
                />
              </View>
              <View>
                <Text style={styles.infoLabel}>KULÜP YETKİLİSİ</Text>
                <Text style={styles.infoValue}>
                  {club.coachName || "Belirtilmedi"}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color={APP_COLORS.primary}
                />
              </View>
              <View>
                <Text style={styles.infoLabel}>TELEFON NUMARASI</Text>
                <Text style={styles.infoValue}>
                  {club.coachPhone || "Belirtilmedi"}
                </Text>
              </View>
            </View>

            {/* Notes Section */}
            <View style={styles.notesBox}>
              <View style={styles.notesHeader}>
                <MaterialCommunityIcons
                  name="note-text-outline"
                  size={16}
                  color="#64748b"
                />
                <Text style={styles.notesLabel}>NOTLAR</Text>
              </View>
              <Text style={styles.notesText} numberOfLines={3}>
                {club.notes || "Henüz bir not eklenmemiş."}
              </Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={handleViewDetails}
            activeOpacity={0.8}
          >
            <Text style={styles.detailsBtnText}>DETAYLARI GÖR</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#fff" />
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  indicator: {
    backgroundColor: "#e2e8f0",
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleGroup: {
    flex: 1,
    marginRight: 12,
  },
  clubName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 20,
  },
  infoSection: {
    gap: 16,
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  notesBox: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 1,
  },
  notesText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  detailsBtn: {
    backgroundColor: APP_COLORS.primary,
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 4,
    shadowColor: APP_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
