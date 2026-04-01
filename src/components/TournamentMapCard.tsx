import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLORS } from '../styles/colors';

type Props = {
  lat: number;
  lng: number;
  locationName?: string;
};

export const TournamentMapCard: React.FC<Props> = ({ lat, lng, locationName }) => {
  const handleOpenMaps = () => {
    const url =
      Platform.OS === 'android'
        ? `geo:${lat},${lng}?q=${lat},${lng}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker coordinate={{ latitude: lat, longitude: lng }} />
        </MapView>
      </View>

      <TouchableOpacity
        style={styles.openBtn}
        onPress={handleOpenMaps}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="google-maps" size={18} color="#ffffff" />
        <Text style={styles.openBtnText}>Haritada Aç</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  mapContainer: {
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    flex: 1,
  },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  openBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
