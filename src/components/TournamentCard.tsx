import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Tournament } from '../types';

type Props = {
  tournament: Tournament;
  onPress: (tournament: Tournament) => void;
};

export const TournamentCard: React.FC<Props> = ({ tournament, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(tournament)} activeOpacity={0.7}>
    <Text style={styles.name}>{tournament.name}</Text>
    {tournament.season ? <Text style={styles.sub}>Sezon: {tournament.season}</Text> : null}
    {tournament.notes ? <Text style={styles.notes} numberOfLines={2}>{tournament.notes}</Text> : null}
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
  name: { color: '#e0e0e0', fontSize: 16, fontWeight: '600' },
  sub: { color: '#4fc3f7', fontSize: 12, marginTop: 4 },
  notes: { color: '#78909c', fontSize: 12, marginTop: 4 },
});
