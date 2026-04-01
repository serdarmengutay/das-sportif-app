import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useClubStore } from "../store/useClubStore";
import { useClubTournamentStore } from "../store/useClubTournamentStore";
import { APP_COLORS } from "../styles/colors";
import type { Club } from "../types";
import { screenHeight } from "../constants/appConstants";

type Props = {
  tournamentId: string;
  onLink: (clubId: string) => Promise<void>;
};

export const LinkClubBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ tournamentId, onLink }, ref) => {
    const [search, setSearch] = useState("");
    const clubs = useClubStore((s) => s.clubs);
    const relations = useClubTournamentStore((s) => s.relations);

    // ── Filtreleme: Zaten ekli olmayanları ve aramaya uyanları getir ──
    const filterableClubs = useMemo(() => {
      const linkedIds = relations
        .filter((r) => r.tournamentId === tournamentId)
        .map((r) => r.clubId);

      return clubs.filter((c) => {
        const isNotLinked = !linkedIds.includes(c.id);
        const matchesSearch = c.name
          .toLowerCase()
          .includes(search.toLowerCase());
        return isNotLinked && matchesSearch;
      });
    }, [clubs, relations, tournamentId, search]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
          pressBehavior="close"
        />
      ),
      [],
    );

    const handleSelect = async (clubId: string) => {
      Keyboard.dismiss();
      await onLink(clubId);
      // Not closing automatically to allow multiple links if desired,
      // but usually users want it closed after selection.
      // The user said "liste aç içinden seçtir", so we'll close it.
      if (typeof ref !== "function" && ref?.current) {
        ref.current.dismiss();
      }
    };

    const renderItem = ({ item }: { item: Club }) => (
      <TouchableOpacity
        style={styles.clubItem}
        onPress={() => handleSelect(item.id)}
      >
        <View style={styles.clubInfo}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="soccer"
              size={20}
              color={APP_COLORS.primary}
            />
          </View>
          <View>
            <Text style={styles.clubName}>{item.name}</Text>
            <Text style={styles.clubLocation}>
              {item.district ? `${item.district}, ` : ""}
              {item.city}
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name="plus-circle-outline"
          size={24}
          color={APP_COLORS.secondary}
        />
      </TouchableOpacity>
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={styles.background}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Kulüp Bağla</Text>
            <Text style={styles.subtitle}>
              Turnuvaya eklenecek kulübü seçin
            </Text>
          </View>

          {/* Arama Çubuğu */}
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Kulüp adı ile ara..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#94a3b8"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={18}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            )}
          </View>

          <BottomSheetFlatList
            data={filterableClubs}
            keyExtractor={(item: Club) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listPadding}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {search
                    ? "Arama sonucu bulunamadı."
                    : "Bağlanabilecek kulüp kalmadı."}
                </Text>
              </View>
            }
          />
        </View>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicator: {
    backgroundColor: "#cbd5e1",
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 12,
    minHeight: screenHeight * 0.6,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    marginHorizontal: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#0f172a",
  },
  clubItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  clubInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  clubName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  clubLocation: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 1,
  },
  listPadding: {
    paddingBottom: 40,
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
  },
});
