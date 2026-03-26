import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useTournamentStore } from '../store/useTournamentStore';
import { useClubTournamentStore } from '../store/useClubTournamentStore';
import { useClubStore } from '../store/useClubStore';
import { ClubCard } from '../components/ClubCard';
import { SCREENS } from '../constants/screenConstants';
import type { TournamentDetailScreenProps } from '../types/navigation';
import type { Club, Tournament } from '../types';

// Let's first check where useClubTournamentStore is located. 
// I'll assume it's in ../store/useClubTournamentStore based on ClubDetailScreen.tsx

export const TournamentDetailScreen: React.FC<TournamentDetailScreenProps> = ({ route, navigation }) => {
  const { tournamentId } = route.params;
  const tournament = useTournamentStore((s) => s.tournaments.find((t) => t.id === tournamentId));
  const removeTournament = useTournamentStore((s) => s.removeTournament);
  const clubs = useClubStore((s) => s.clubs);
  const getClubIds = useClubTournamentStore((s) => s.getClubIds);
  const link = useClubTournamentStore((s) => s.link);

  const [relatedClubs, setRelatedClubs] = useState<Club[]>([]);

  useEffect(() => {
    const ids = getClubIds(tournamentId);
    setRelatedClubs(clubs.filter((c) => ids.includes(c.id)));
  }, [tournamentId, getClubIds, clubs]);

  const handleDelete = useCallback(() => {
    Alert.alert('Turnuvayı Sil', `"${tournament?.name}" silinsin mi?`, [
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
  }, [tournament?.name, tournamentId, removeTournament, navigation]);

  const handleLinkClub = useCallback(() => {
    const unlinkedClubs = clubs.filter(
      (c) => !relatedClubs.some((rc) => rc.id === c.id),
    );

    if (unlinkedClubs.length === 0) {
      Alert.alert('Bilgi', 'Bağlanacak başka kulüp yok.');
      return;
    }

    const buttons: { text: string; onPress?: () => void }[] = unlinkedClubs.slice(0, 5).map((c) => ({
      text: c.name,
      onPress: () => { link(c.id, tournamentId); },
    }));
    buttons.push({ text: 'İptal' });

    Alert.alert('Kulüp Bağla', 'Hangi kulübü bağlamak istiyorsunuz?', buttons);
  }, [clubs, relatedClubs, link, tournamentId]);

  const handleClubPress = (club: Club) => {
    navigation.push(SCREENS.CLUB_DETAIL, { clubId: club.id });
  };

  if (!tournament) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>Turnuva bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.name}>{tournament.name}</Text>

      {tournament.season ? <Text style={styles.sub}>Sezon: {tournament.season}</Text> : null}
      {tournament.notes ? <Text style={styles.notes}>{tournament.notes}</Text> : null}

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>İlişkili Kulüpler ({relatedClubs.length})</Text>
        <TouchableOpacity onPress={handleLinkClub}>
          <Text style={styles.linkBtn}>+ Bağla</Text>
        </TouchableOpacity>
      </View>

      {relatedClubs.length > 0 ? (
        relatedClubs.map((c) => <ClubCard key={c.id} club={c} onPress={() => handleClubPress(c)} />)
      ) : (
        <Text style={styles.empty}>Henüz ilişkili kulüp yok.</Text>
      )}

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Turnuvayı Sil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  name: { color: '#e0e0e0', fontSize: 24, fontWeight: '700' },
  sub: { color: '#4fc3f7', fontSize: 14, marginTop: 8 },
  notes: { color: '#90a4ae', fontSize: 14, marginTop: 12 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 8 },
  sectionTitle: { color: '#4fc3f7', fontSize: 16, fontWeight: '600' },
  linkBtn: { color: '#66bb6a', fontSize: 14, fontWeight: '600' },
  empty: { color: '#546e7a', fontSize: 13, marginTop: 4 },
  deleteBtn: { backgroundColor: '#b71c1c', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 32 },
  deleteBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
