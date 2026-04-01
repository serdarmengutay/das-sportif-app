import * as Location from 'expo-location';

type GeoResult = {
  city: string;
  district: string;
};

/**
 * Reverse geocoding ile lat/lng → şehir ve ilçe bilgisi döndürür.
 * expo-location'ın reverseGeocodeAsync metodunu kullanır.
 */
export const getCityAndDistrictFromCoords = async (
  lat: number,
  lng: number,
): Promise<GeoResult> => {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    if (results.length > 0) {
      const place = results[0];
      return {
        city: place.city || place.region || '',
        district: place.district || place.subregion || '',
      };
    }

    return { city: '', district: '' };
  } catch (error) {
    console.warn('Reverse geocoding hatası:', error);
    return { city: '', district: '' };
  }
};
