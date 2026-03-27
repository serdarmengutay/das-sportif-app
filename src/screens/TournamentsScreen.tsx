import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { useTournamentStore } from '../store/useTournamentStore';
import { SummaryCard } from '../components/SummaryCard';
import { TournamentCard } from '../components/TournamentCard';
import { AddTournamentBottomSheet } from '../components/AddTournamentBottomSheet';

export const TournamentsScreen = () => {
  const navigation = useNavigation<any>();
  const { tournaments, loading, loadTournaments } = useTournamentStore();
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  const stats = useMemo(() => {
    const active = tournaments.filter((t) => t.status === 'active').length;
    const completed = tournaments.filter((t) => t.status === 'completed').length;
    const pending = tournaments.filter((t) => t.status === 'planned').length;

    return [
      {
        label: 'AKTİF TURNUVALAR',
        value: active.toString().padStart(2, '0'),
        icon: <Text style={{ fontSize: 24, opacity: 0.5 }}>🏆</Text>,
        color: '#854D0E',
      },
      {
        label: 'TAMAMLANAN',
        value: completed.toString().padStart(2, '0'),
        icon: <Text style={{ fontSize: 24, opacity: 0.5 }}>✔️</Text>,
        color: '#1E293B',
      },
      {
        label: 'KAYIT BEKLEYEN',
        value: pending.toString().padStart(2, '0'),
        icon: <Text style={{ fontSize: 24, opacity: 0.5 }}>🕒</Text>,
        color: '#64748B',
      },
    ];
  }, [tournaments]);

  const handlePressTournament = (tournamentId: string) => {
    navigation.navigate('TournamentDetail', { tournamentId });
  };

  const handleNewTournament = () => {
    bottomSheetRef.current?.expand();
  };

  const handleFilter = () => {
    console.log('Open Filter Modal');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.mainTitle}>Turnuvalarım</Text>
      <SummaryCard items={stats} />
      
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleNewTournament}>
          <Text style={styles.buttonPrimaryText}>+ Yeni Turnuva</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buttonSecondary} onPress={handleFilter}>
          <Text style={styles.buttonSecondaryText}>≡ Filtrele</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.countText}>Toplam {tournaments.length} turnuva gösteriliyor</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TournamentCard tournament={item} onPress={handlePressTournament} />}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadTournaments} />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Henüz turnuva bulunmuyor.</Text>
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
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  buttonPrimary: {
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonSecondary: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  buttonSecondaryText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  countText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});
