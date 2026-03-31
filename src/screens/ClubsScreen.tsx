import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClubStore } from "../store/useClubStore";
import { SummaryCard } from "../components/SummaryCard";
import { ClubCard } from "../components/ClubCard";
import { APP_COLORS } from "../styles/colors";

export const ClubsScreen = () => {
  const navigation = useNavigation<any>();
  const { clubs, loading, loadClubs } = useClubStore();

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  const stats = React.useMemo(() => {
    if (clubs.length === 0) {
      return { total: 0, deal: 0, pending: 0 };
    }
    const total = clubs.length;
    const deal = clubs.filter((c) => c.status === "deal").length;
    const pending = clubs.filter((c) => c.status !== "deal").length;
    return { total, deal, pending };
  }, [clubs]);

  const handlePressClub = (clubId: string) => {
    navigation.navigate("ClubDetail", { clubId });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <SummaryCard
        total={stats.total}
        deal={stats.deal}
        pending={stats.pending}
      />
      <Text style={styles.sectionTitle}>Kulüpler</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <FlatList
          data={clubs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClubCard club={item} onPress={handlePressClub} />
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadClubs} />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Henüz kulüp bulunmuyor.</Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_COLORS.light_bg,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginTop: 12,
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
