import React, { useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useTournaments } from '../hooks/useTournaments';
import { TournamentCard } from '../components/TournamentCard';
import type { TournamentsScreenProps } from '../types/navigation';
import type { Tournament } from '../types';
import { useTournamentStore } from '../store/useTournamentStore';

export const TournamentsScreen: React.FC<TournamentsScreenProps> = ({ navigation }) => {
  const { tournaments, loading } = useTournaments();
  const addTournament = useTournamentStore((s) => s.addTournament);

  const handlePress = (tournament: Tournament) => {
    navigation.navigate('TournamentDetail', { tournamentId: tournament.id });
  };

  const handleAdd = useCallback(() => {
    if (require('react-native').Platform.OS === 'ios') {
      Alert.prompt('Yeni Turnuva', 'Turnuva adını girin:', [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Oluştur',
          onPress: (name?: string) => {
            if (!name?.trim()) return;
            addTournament({ name: name.trim(), season: '', startDate: null, endDate: null, notes: '' });
          },
        },
      ], 'plain-text');
    } else {
      addTournament({ name: `Turnuva ${tournaments.length + 1}`, season: '', startDate: null, endDate: null, notes: '' });
    }
  }, [addTournament, tournaments.length]);

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
      <TouchableOpacity style={styles.fab} onPress={handleAdd} activeOpacity={0.8}>
        <Text style={{ fontSize: 24, color: '#fff' }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  list: { paddingVertical: 8 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  empty: { color: '#78909c', fontSize: 14, textAlign: 'center' },
  fab: {
    position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#4fc3f7', justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4,
  },
});
