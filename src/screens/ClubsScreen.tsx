import React from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useClubs } from '../hooks/useClubs';
import { ClubCard } from '../components/ClubCard';
import { SCREENS } from '../constants/screenConstants';
import type { ClubsScreenProps } from '../types/navigation';
import type { Club } from '../types';

export const ClubsScreen: React.FC<ClubsScreenProps> = ({ navigation }) => {
  const { clubs, loading } = useClubs();

  const handlePress = (club: Club) => {
    navigation.navigate(SCREENS.CLUB_DETAIL, { clubId: club.id });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4fc3f7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ClubCard club={item} onPress={handlePress} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.empty}>Henüz kulüp eklenmedi.{'\n'}Haritada uzun basarak ekleyebilirsiniz.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  list: { paddingVertical: 8 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  empty: { color: '#78909c', fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
