import React from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useTournamentStore } from '../store/useTournamentStore';
import { TournamentCard } from '../components/TournamentCard';
import { SCREENS } from '../constants/screenConstants';
import type { TournamentsScreenProps } from '../types/navigation';
import type { Tournament } from '../types';

export const TournamentsScreen: React.FC<TournamentsScreenProps> = ({ navigation }) => {
  const tournaments = useTournamentStore((s) => s.tournaments);
  const loading = false; // Store'da loading state yok, şimdilik statik

  const handlePress = (tournament: Tournament) => {
    navigation.navigate(SCREENS.TOURNAMENT_DETAIL, { tournamentId: tournament.id });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4fc3f7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tournaments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TournamentCard tournament={item} onPress={handlePress} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.empty}>Henüz turnuva eklenmedi.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  list: { paddingVertical: 8 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  empty: { color: '#78909c', fontSize: 14, textAlign: 'center' },
});
