import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Club, ClubStatus } from '../types';

interface ClubCardProps {
  club: Club;
  onPress: (id: string) => void;
}

const getStatusConfig = (status: ClubStatus) => {
  switch (status) {
    case 'deal':
      return { text: 'ONAYLANDI', backgroundColor: '#FDE047', color: '#854D0E' };
    case 'negotiation':
      return { text: 'GÖRÜŞÜLÜYOR', backgroundColor: '#1E293B', color: '#F1F5F9' };
    case 'proposal':
      return { text: 'TEKLİF', backgroundColor: '#DBEAFE', color: '#1E40AF' };
    case 'visited':
    default:
      return { text: 'ZİYARET EDİLDİ', backgroundColor: '#F1F5F9', color: '#475569' };
  }
};

export const ClubCard: React.FC<ClubCardProps> = ({ club, onPress }) => {
  const statusConfig = getStatusConfig(club.status);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      onPress={() => onPress(club.id)}
    >
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>{club.name.substring(0, 2).toUpperCase()}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{club.name}</Text>
          <View style={[styles.badge, { backgroundColor: statusConfig.backgroundColor }]}>
            <Text style={[styles.badgeText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>
        </View>
        
        <Text style={styles.location}>
          {club.city.toUpperCase()}, {club.district.toUpperCase()}
        </Text>
        
        {club.notes ? (
          <Text style={styles.notes} numberOfLines={3}>
            {club.notes}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  imageText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    minWidth: 120, // Prevents pushing the badge off-screen completely
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  location: {
    fontSize: 11,
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
    fontWeight: '600',
  },
  notes: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
});
