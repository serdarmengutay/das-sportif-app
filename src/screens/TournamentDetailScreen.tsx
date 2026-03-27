import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTournamentStore } from '../store/useTournamentStore';
import { useClubTournamentStore } from '../store/useClubTournamentStore';
import { useClubStore } from '../store/useClubStore';
import { APP_COLORS } from '../styles/colors';
import { SCREENS } from '../constants/screenConstants';
import type { TournamentDetailScreenProps } from '../types/navigation';
import type { Club, TournamentStatus } from '../types';

const STATUS_LABELS: Record<TournamentStatus, string> = {
  active: 'AKTİF',
  planned: 'PLANLANDI',
  completed: 'TAMAMLANDI',
};

const STATUS_COLORS: Record<TournamentStatus, string> = {
  active: '#10B981', // green
  planned: '#F59E0B', // amber
  completed: '#64748B', // slate
};

export const TournamentDetailScreen: React.FC<TournamentDetailScreenProps> = () => {
  const navigation = useNavigation<TournamentDetailScreenProps['navigation']>();
  const route = useRoute<TournamentDetailScreenProps['route']>();
  const { tournamentId } = route.params;

  const tournament = useTournamentStore((s) => s.tournaments.find((t) => t.id === tournamentId));
  const removeTournament = useTournamentStore((s) => s.removeTournament);
  const clubs = useClubStore((s) => s.clubs);
  const { getClubIds, link } = useClubTournamentStore();

  const [relatedClubs, setRelatedClubs] = useState<Club[]>([]);

  useEffect(() => {
    const ids = getClubIds(tournamentId);
    setRelatedClubs(clubs.filter((c) => ids.includes(c.id)));
  }, [tournamentId, getClubIds, clubs]);

  const handleDelete = useCallback(() => {
    if (!tournament) return;
    Alert.alert('Turnuvayı Sil', `"${tournament.name}" silinsin mi?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await removeTournament(tournamentId);
          navigation.goBack();
        },
      },
    ]);
  }, [tournament, tournamentId, removeTournament, navigation]);

  const handleLinkClub = useCallback(() => {
    const unlinkedClubs = clubs.filter((c) => !relatedClubs.some((rc) => rc.id === c.id));
    
    if (unlinkedClubs.length === 0) {
      Alert.alert('Bilgi', 'Bağlanacak başka kulüp yok.');
      return;
    }

    const buttons: { text: string; onPress?: () => void }[] = unlinkedClubs.slice(0, 5).map((c) => ({
      text: c.name,
      onPress: () => link(c.id, tournamentId),
    }));
    buttons.push({ text: 'İptal' });

    Alert.alert('Kulüp Seç', 'Turnuvaya hangi kulübü bağlamak istiyorsunuz?', buttons);
  }, [clubs, relatedClubs, link, tournamentId]);

  const handleClubPress = (clubId: string) => {
    navigation.navigate(SCREENS.CLUB_DETAIL, { clubId });
  };

  const formatDate = (ts: number | null) => {
    if (!ts) return 'Belirtilmedi';
    const d = new Date(ts);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  };

  if (!tournament) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Turnuva bulunamadı.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>{tournament.name}</Text>
          <Text style={styles.dateRange}>
            📅 {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
          </Text>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Turnuva Bilgileri</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>DURUM:</Text>
            <View style={[styles.badge, { backgroundColor: STATUS_COLORS[tournament.status] }]}>
              <Text style={styles.badgeText}>{STATUS_LABELS[tournament.status]}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>LOKASYON:</Text>
            <Text style={styles.infoValue}>{tournament.locationName || 'Belirtilmedi'} ({tournament.city})</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>KATILIMCI SAYISI:</Text>
            <Text style={styles.infoValue}>{tournament.participantCount || 0}</Text>
          </View>
        </View>

        {/* Clubs Relation Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Katılımcı Kulüpler ({relatedClubs.length})</Text>
            <TouchableOpacity onPress={handleLinkClub}>
              <Text style={styles.linkText}>+ Kulüp Ekle</Text>
            </TouchableOpacity>
          </View>
          
          {relatedClubs.length > 0 ? (
            relatedClubs.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.clubCard}
                onPress={() => handleClubPress(c.id)}
              >
                <View>
                  <Text style={styles.clubName}>{c.name}</Text>
                  <Text style={styles.clubCity}>{c.city}</Text>
                </View>
                <Text style={styles.clubArrow}>→</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Bu turnuvaya henüz kulüp katılmamış.</Text>
          )}
        </View>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Turnuvayı Sil</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: APP_COLORS.primary,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  dateRange: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12, // Default bottom margin, overridden if in sectionHeader
  },
  linkText: {
    color: APP_COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  clubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clubName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  clubCity: {
    fontSize: 13,
    color: '#64748B',
  },
  clubArrow: {
    fontSize: 20,
    color: '#94A3B8',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  deleteBtn: {
    marginTop: 24,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
});
