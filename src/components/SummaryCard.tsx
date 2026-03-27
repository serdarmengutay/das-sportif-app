import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryCardProps {
  items: {
    label: string;
    value: string;
    subtext?: string;
    icon?: React.ReactNode;
    color: string;
  }[];
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={[styles.card, { borderLeftColor: item.color }]}>
          <View style={styles.content}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.row}>
              <Text style={styles.value}>{item.value}</Text>
              {item.subtext ? (
                <Text style={styles.subtext}>{item.subtext}</Text>
              ) : null}
              {item.icon ? <View style={styles.iconContainer}>{item.icon}</View> : null}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtext: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 12,
    fontWeight: '500',
  },
  iconContainer: {
    marginLeft: 'auto',
    opacity: 0.3,
  },
});
