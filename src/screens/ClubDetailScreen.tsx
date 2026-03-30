import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useClubStore } from '../store/useClubStore';
import { useTournamentStore } from '../store/useTournamentStore';
import { useClubTournamentStore } from '../store/useClubTournamentStore';
import { APP_COLORS } from '../styles/colors';
import { SCREENS } from '../constants/screenConstants';
import type { ClubDetailScreenProps } from '../types/navigation';
import type { ClubStatus, Tournament } from '../types';

export const ClubDetailScreen: React.FC<ClubDetailScreenProps> = () => {
  const navigation = useNavigation<ClubDetailScreenProps['navigation']>();
  const route = useRoute<ClubDetailScreenProps['route']>();
  const { clubId } = route.params;

  const { clubs, updateClub } = useClubStore();
  const { tournaments } = useTournamentStore();
  const { getTournamentIds } = useClubTournamentStore();

  const club = clubs.find((c) => c.id === clubId);

  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<ClubStatus>('proposal');
  const [notes, setNotes] = useState('');
  const [coachPhone, setCoachPhone] = useState('');

  // Related tournaments
  const [relatedTournaments, setRelatedTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    if (club) {
      setStatus(club.status);
      setNotes(club.notes || '');
      setCoachPhone(club.coachPhone || '');
    }
  }, [club]);

  useEffect(() => {
    if (club) {
      const ids = getTournamentIds(club.id);
      const rt = tournaments.filter((t) => ids.includes(t.id));
      setRelatedTournaments(rt);
    }
  }, [club, getTournamentIds, tournaments]);

  const handleSave = useCallback(async () => {
    if (!club) return;
    await updateClub(club.id, {
      status,
      notes,
      coachPhone,
    });
    setIsEditing(false);
  }, [club, updateClub, status, notes, coachPhone]);

  const handleCancel = useCallback(() => {
    if (club) {
      setStatus(club.status);
      setNotes(club.notes || '');
      setCoachPhone(club.coachPhone || '');
    }
    setIsEditing(false);
  }, [club]);

  const handleTournamentPress = (tournamentId: string) => {
    navigation.push(SCREENS.TOURNAMENT_DETAIL, { tournamentId });
  };

  if (!club) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>Kulüp bulunamadı.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Geri</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusLabel =
    status === 'visited' ? 'ZİYARET EDİLDİ' :
    status === 'proposal' ? 'TEKLİF' :
    status === 'negotiation' ? 'GÖRÜŞME' : 'ANLAŞMA';

  const statusColor =
    status === 'visited' ? '#66bb6a' :
    status === 'proposal' ? '#ffa726' :
    status === 'negotiation' ? '#42a5f5' : '#ab47bc';

  const renderViewMode = () => (
    <>
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusBadgeText}>{statusLabel}</Text>
        </View>
        <Text style={styles.title}>{club.name}</Text>
        <Text style={styles.subtitle}>
          📍 {club.district ? `${club.district}, ` : ''}{club.city}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
        <Text style={styles.infoText}>Antrenör Telefonu: {club.coachPhone || '-'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Görüşme Notları</Text>
        <Text style={styles.infoText}>{club.notes || 'Henüz not eklenmemiş.'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bağlı Turnuvalar</Text>
        {relatedTournaments.length > 0 ? (
          relatedTournaments.map((t) => (
            <TouchableOpacity 
              key={t.id} 
              style={styles.tournamentRow}
              onPress={() => handleTournamentPress(t.id)}
            >
              <Text style={styles.tournamentName}>🏆 {t.name}</Text>
              <Text style={styles.tournamentStatus}>
                {t.status === 'active' ? 'Aktif' : t.status === 'planned' ? 'Planlandı' : 'Tamamlandı'}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.infoText}>Henüz bir turnuva ile ilişkilendirilmemiş.</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setIsEditing(true)}>
          <Text style={styles.primaryBtnText}>Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryBtnText}>Geri</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderEditMode = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{club.name}</Text>
        <Text style={styles.subtitle}>Düzenleme Modu</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>DURUM</Text>
        <View style={styles.statusRow}>
          {(['visited', 'proposal', 'negotiation', 'deal'] as ClubStatus[]).map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.statusBtn,
                status === s && styles.statusBtnActive,
              ]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.statusBtnText, status === s && styles.statusBtnTextActive]}>
                {s === 'visited' ? 'ZİYARET' : s === 'proposal' ? 'TEKLİF' : s === 'negotiation' ? 'GÖRÜŞME' : 'ANLAŞMA'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>ANTRENÖR TELEFONU</Text>
        <TextInput
          style={styles.input}
          value={coachPhone}
          onChangeText={setCoachPhone}
          placeholder="Örn: 0555 555 5555"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>GÖRÜŞME NOTLARI</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notlarınızı buraya ekleyebilirsiniz..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleCancel}>
          <Text style={styles.secondaryBtnText}>İptal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
          <Text style={styles.primaryBtnText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isEditing ? renderEditMode() : renderViewMode()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_COLORS.primary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginVertical: 20,
  },
  backBtn: {
    alignSelf: 'center',
    padding: 12,
  },
  backBtnText: {
    color: APP_COLORS.primary,
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
  },
  tournamentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tournamentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  tournamentStatus: {
    fontSize: 13,
    color: '#64748B',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: APP_COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusBtnActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#38BDF8',
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  statusBtnTextActive: {
    color: '#0284C7',
  },
});
