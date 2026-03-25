import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useClubStore } from '../store/useClubStore';
import { useClubTournamentStore } from '../store/useClubTournamentStore';
import { useTournamentStore } from '../store/useTournamentStore';
import { TournamentCard } from '../components/TournamentCard';
import type { ClubDetailScreenProps } from '../types/navigation';
import type { Club, ClubStatus, Tournament } from '../types';

const STATUS_LABELS: Record<ClubStatus, string> = {
  visited: 'Ziyaret Edildi', proposal: 'Teklif', negotiation: 'Görüşme', deal: 'Anlaşma',
};

const STATUS_COLORS: Record<ClubStatus, string> = {
  visited: '#66bb6a', proposal: '#ffa726', negotiation: '#42a5f5', deal: '#ab47bc',
};

export const ClubDetailScreen: React.FC<ClubDetailScreenProps> = ({ route, navigation }) => {
  const { clubId } = route.params;
  const club = useClubStore((s) => s.clubs.find((c) => c.id === clubId));
  const removeClub = useClubStore((s) => s.removeClub);
  const tournaments = useTournamentStore((s) => s.tournaments);
  const getTournamentIds = useClubTournamentStore((s) => s.getTournamentIds);

  const [relatedTournaments, setRelatedTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const ids = getTournamentIds(clubId);
    setRelatedTournaments(tournaments.filter((t) => ids.includes(t.id)));
  }, [clubId, getTournamentIds, tournaments]);

  const handleDelete = useCallback(() => {
    Alert.alert('Kulübü Sil', `"${club?.name}" silinsin mi?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await removeClub(clubId);
          navigation.goBack();
        },
      },
    ]);
  }, [club?.name, clubId, removeClub, navigation]);

  if (!club) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>Kulüp bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.name}>{club.name}</Text>

      <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[club.status] }]}>
        <Text style={styles.statusText}>{STATUS_LABELS[club.status]}</Text>
      </View>

      {(club.city || club.district) && (
        <Text style={styles.sub}>
          📍 {club.district ? `${club.district}, ` : ''}{club.city}
        </Text>
      )}

      <Text style={styles.coord}>
        {club.lat.toFixed(5)}, {club.lng.toFixed(5)}
      </Text>

      {club.notes ? <Text style={styles.notes}>{club.notes}</Text> : null}

      <Text style={styles.sectionTitle}>İlişkili Turnuvalar ({relatedTournaments.length})</Text>
      {relatedTournaments.length > 0 ? (
        relatedTournaments.map((t) => (
          <TournamentCard key={t.id} tournament={t} onPress={() => {}} />
        ))
      ) : (
        <Text style={styles.empty}>Henüz ilişkili turnuva yok.</Text>
      )}

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Kulübü Sil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  name: { color: '#e0e0e0', fontSize: 24, fontWeight: '700' },
  sub: { color: '#78909c', fontSize: 14, marginTop: 8 },
  coord: { color: '#546e7a', fontSize: 12, marginTop: 4 },
  notes: { color: '#90a4ae', fontSize: 14, marginTop: 12 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  statusText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  sectionTitle: { color: '#4fc3f7', fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 8 },
  empty: { color: '#546e7a', fontSize: 13, marginTop: 4 },
  deleteBtn: { backgroundColor: '#b71c1c', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 32 },
  deleteBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
