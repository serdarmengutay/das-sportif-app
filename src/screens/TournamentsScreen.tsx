import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";
import { useTournamentStore } from "../store/useTournamentStore";
import { TournamentCard } from "../components/TournamentCard";
import { AddTournamentBottomSheet } from "../components/AddTournamentBottomSheet";
import { APP_COLORS } from "../styles/colors";

export const TournamentsScreen = () => {
  const navigation = useNavigation<any>();
  const { tournaments, loading, loadTournaments } = useTournamentStore();
  const bottomSheetRef = useRef<BottomSheet>(null);

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
});
