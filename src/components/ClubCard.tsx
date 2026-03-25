import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Club, ClubStatus } from '../types';

const STATUS_LABELS: Record<ClubStatus, string> = {
  visited: 'Ziyaret Edildi',
  proposal: 'Teklif',
  negotiation: 'Görüşme',
  deal: 'Anlaşma',
};

const STATUS_COLORS: Record<ClubStatus, string> = {
  visited: '#66bb6a',
  proposal: '#ffa726',
  negotiation: '#42a5f5',
  deal: '#ab47bc',
};

type Props = {
  club: Club;
  onPress: (club: Club) => void;
};

export const ClubCard: React.FC<Props> = ({ club, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(club)} activeOpacity={0.7}>
    <View style={styles.row}>
      <Text style={styles.name}>{club.name}</Text>
      <View style={[styles.badge, { backgroundColor: STATUS_COLORS[club.status] }]}>
        <Text style={styles.badgeText}>{STATUS_LABELS[club.status]}</Text>
      </View>
    </View>
    {(club.city || club.district) && (
      <Text style={styles.sub}>
        {club.district ? `${club.district}, ` : ''}{club.city}
      </Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { color: '#e0e0e0', fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8 },
  sub: { color: '#78909c', fontSize: 12, marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
});
