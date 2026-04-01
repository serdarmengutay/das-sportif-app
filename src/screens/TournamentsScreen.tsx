import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTournamentStore } from "../store/useTournamentStore";
import { TournamentCard } from "../components/TournamentCard";
import { AddTournamentBottomSheet } from "../components/AddTournamentBottomSheet";
import { APP_COLORS } from "../styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const TournamentsScreen = () => {
  const navigation = useNavigation<any>();
  const { tournaments, loading, loadTournaments } = useTournamentStore();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenAddModal = () => {
    bottomSheetRef.current?.present();
  };

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  const handlePressTournament = (tournamentId: string) => {
    navigation.navigate("TournamentDetail", { tournamentId });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.screenTitle}>Turnuvalar</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TournamentCard
              tournament={item}
              onPress={handlePressTournament}
            />
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadTournaments} />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Henüz turnuva bulunmuyor.
                </Text>
              </View>
            ) : null
          }
        />
        <TouchableOpacity
          style={styles.fab}
          onPress={handleOpenAddModal}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="plus" size={30} color="#fff" />
        </TouchableOpacity>
        <AddTournamentBottomSheet ref={bottomSheetRef} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_COLORS.light_bg,
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 8,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 32,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: APP_COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
