import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Tournament, TournamentStatus } from '../types';

interface TournamentCardProps {
  tournament: Tournament;
  onPress: (id: string) => void;
}

const getStatusConfig = (status: TournamentStatus) => {
  switch (status) {
    case 'active':
      return { text: 'DEVAM EDİYOR', backgroundColor: '#FDE047', color: '#854D0E' };
    case 'completed':
      return { text: 'TAMAMLANDI', backgroundColor: '#F1F5F9', color: '#475569' };
    case 'planned':
    default:
      return { text: 'PLANLANDI', backgroundColor: '#1E293B', color: '#F1F5F9' };
  }
};

const formatDate = (timestamp: number | null) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
};

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onPress }) => {
  const statusConfig = getStatusConfig(tournament.status);
  
  const startStr = formatDate(tournament.startDate);
  const endStr = formatDate(tournament.endDate);
  const dateText = startStr && endStr ? `${startStr} - ${endStr}` : startStr || endStr || 'Tarih Belirlenmedi';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      onPress={() => onPress(tournament.id)}
    >
      <View style={styles.imagePlaceholder}>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.text}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{tournament.name}</Text>
          <Text style={styles.menuIcon}>⋮</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.rowText}>{dateText}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.rowText}>
            {tournament.locationName}, {tournament.city}
          </Text>
        </View>

        <View style={[styles.row, styles.bottomRow]}>
          <View style={styles.item}>
            <Text style={styles.icon}>👥</Text>
            <Text style={styles.bottomText}>{tournament.participantCount} Katılımcı Kulüp</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  imagePlaceholder: {
    height: 140,
    backgroundColor: '#E2E8F0',
    padding: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    color: '#0F172A',
    fontWeight: '800',
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 14,
    marginRight: 8,
  },
  rowText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  bottomRow: {
    marginTop: 8,
    marginBottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  bottomText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
});
