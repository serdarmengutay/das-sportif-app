import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBadge, type StatusBadgeConfig } from './StatusBadge';
import type { Club, ClubStatus } from '../types';

const getClubStatusConfig = (status: ClubStatus): StatusBadgeConfig => {
  switch (status) {
    case 'deal':
      return {
        text: 'Anlaşıldı',
        backgroundColor: '#a855f7',
        color: '#ffffff',
        icon: 'handshake',
      };
    case 'negotiation':
      return {
        text: 'Görüşülüyor',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        icon: 'chat-processing-outline',
      };
    case 'proposal':
      return {
        text: 'Teklif',
        backgroundColor: '#f97316',
        color: '#ffffff',
        icon: 'file-document-edit-outline',
      };
    case 'visited':
    default:
      return {
        text: 'Ziyaret Edildi',
        backgroundColor: '#22c55e',
        color: '#ffffff',
        icon: 'map-marker-check-outline',
      };
  }
};

type Props = {
  club: Club;
  onPress: (clubId: string) => void;
};

export const TournamentClubCard: React.FC<Props> = ({ club, onPress }) => {
  const statusConfig = getClubStatusConfig(club.status);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
      onPress={() => onPress(club.id)}
    >
      <View style={styles.topRow}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {club.name}
          </Text>
          <View style={styles.locationRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={14}
              color="#64748b"
            />
            <Text style={styles.locationText}>
              {club.district ? `${club.district}, ` : ''}
              {club.city || '—'}
            </Text>
          </View>
        </View>
        <StatusBadge config={statusConfig} />
      </View>

      {/* Coach Info */}
      {club.coachName ? (
        <View style={styles.coachRow}>
          <MaterialCommunityIcons
            name="account-outline"
            size={14}
            color="#64748b"
          />
          <Text style={styles.coachText}>{club.coachName}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  coachText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
});
