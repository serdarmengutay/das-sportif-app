import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClubStore } from '../store/useClubStore';
import { SummaryCard } from '../components/SummaryCard';
import { ClubCard } from '../components/ClubCard';

export const ClubsScreen = () => {
  const navigation = useNavigation<any>();
  const { clubs, loading, loadClubs } = useClubStore();

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  const stats = useMemo(() => {
    const total = clubs.length;
    const approved = clubs.filter((c) => c.status === 'deal').length;
    const pending = clubs.filter((c) => c.status === 'negotiation' || c.status === 'proposal').length;
    const approvedRate = total > 0 ? Math.round((approved / total) * 100) : 0;

    return [
      {
        label: 'TOPLAM KULÜP',
        value: total.toString().padStart(2, '0'),
        subtext: '+0 Bu Hafta',
        color: '#0F172A',
      },
      {
        label: 'ONAYLANANLAR',
        value: approved.toString().padStart(2, '0'),
        subtext: `%${approvedRate} Oran`,
        color: '#854D0E',
      },
      {
        label: 'BEKLEYENLER',
        value: pending.toString().padStart(2, '0'),
        subtext: 'İşlem Gerekli',
        color: '#0F172A', // using a neutral dark for pending or red depending on preference
      },
    ];
  }, [clubs]);

  const handlePressClub = (clubId: string) => {
    navigation.navigate('ClubDetail', { clubId });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <SummaryCard items={stats} />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>KULÜPLERİM</Text>
        <TouchableOpacity>
          <Text style={styles.filterText}>FİLTRELE: TÜMÜ ≡</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <FlatList
          data={clubs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ClubCard club={item} onPress={handlePressClub} />}
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
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
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
