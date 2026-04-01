import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { APP_COLORS } from '../styles/colors';
import { useTournamentStore } from '../store/useTournamentStore';
import { getCityAndDistrictFromCoords } from '../utils/getCityAndDistrictFromCoords';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import type { TournamentStatus } from '../types';

const TOURNAMENT_STATUS_OPTIONS: { value: TournamentStatus; label: string }[] = [
  { value: 'planned', label: 'Planlanan' },
  { value: 'active', label: 'Aktif' },
  { value: 'completed', label: 'Tamamlandı' },
];

type Props = {
  onDismiss?: () => void;
};

export const AddTournamentBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ onDismiss }, ref) => {
    const addTournament = useTournamentStore((s) => s.addTournament);
    const snapPoints = useMemo(() => ['60%', '90%'], []);

    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [locationName, setLocationName] = useState('');
    const [startDateStr, setStartDateStr] = useState('');
    const [endDateStr, setEndDateStr] = useState('');
    const [participantCountStr, setParticipantCountStr] = useState('');
    const [status, setStatus] = useState<TournamentStatus>('planned');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      (async () => {
        try {
          const { status: perm } = await Location.getForegroundPermissionsAsync();
          if (perm !== 'granted') return;

          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const geo = await getCityAndDistrictFromCoords(
            loc.coords.latitude,
            loc.coords.longitude,
          );
          if (geo.city) setCity(geo.city);
        } catch {
          // Konum alınamazsa sessizce geç
        }
      })();
    }, []);

    const resetForm = useCallback(() => {
      setName('');
      setCity('');
      setLocationName('');
      setStartDateStr('');
      setEndDateStr('');
      setParticipantCountStr('');
      setStatus('planned');
    }, []);

    const closeSheet = useCallback(() => {
      if (typeof ref !== 'function' && ref?.current) {
        ref.current.dismiss();
      }
      onDismiss?.();
    }, [ref, onDismiss]);

    const validateDates = useCallback(
      (start: string, end: string): { startDate: number | null; endDate: number | null } | null => {
        let startDate: number | null = null;
        let endDate: number | null = null;

        if (start.trim()) {
          const parsed = new Date(start.trim()).getTime();
          if (isNaN(parsed)) {
            Alert.alert('Uyarı', 'Başlangıç tarihi geçersiz. Format: YYYY-MM-DD');
            return null;
          }
          startDate = parsed;
        }

        if (end.trim()) {
          const parsed = new Date(end.trim()).getTime();
          if (isNaN(parsed)) {
            Alert.alert('Uyarı', 'Bitiş tarihi geçersiz. Format: YYYY-MM-DD');
            return null;
          }
          endDate = parsed;
        }

        if (startDate && endDate && endDate < startDate) {
          Alert.alert('Uyarı', 'Bitiş tarihi başlangıçtan önce olamaz.');
          return null;
        }

        return { startDate, endDate };
      },
      [],
    );

    const handleSave = useCallback(async () => {
      if (!name.trim()) {
        Alert.alert('Uyarı', 'Turnuva adı zorunludur.');
        return;
      }

      const participantCount = parseInt(participantCountStr, 10) || 0;
      if (participantCountStr.trim() && participantCount <= 0) {
        Alert.alert('Uyarı', 'Katılımcı sayısı 0\'dan büyük olmalıdır.');
        return;
      }

      const dates = validateDates(startDateStr, endDateStr);
      if (dates === null) return;

      setSaving(true);
      try {
        await addTournament({
          name: name.trim(),
          city: city.trim(),
          locationName: locationName.trim(),
          startDate: dates.startDate,
          endDate: dates.endDate,
          status,
          participantCount,
        });
        resetForm();
        closeSheet();
      } catch (err) {
        console.warn('Turnuva kaydedilemedi:', err);
        Alert.alert('Hata', 'Turnuva kaydedilirken bir sorun oluştu.');
      } finally {
        setSaving(false);
      }
    }, [
      name, city, locationName, startDateStr, endDateStr,
      status, participantCountStr, addTournament, resetForm,
      closeSheet, validateDates,
    ]);

    const handleCancel = useCallback(() => {
      resetForm();
      closeSheet();
    }, [resetForm, closeSheet]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
          pressBehavior="close"
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={onDismiss}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.indicator}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <BottomSheetScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Yeni Turnuva</Text>
                <Text style={styles.subtitle}>Turnuva bilgilerini gir</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={handleCancel}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <InputField
              label="Turnuva Adı"
              icon="text-box"
              placeholder="Örn: Elite Pro Cup 2024"
              value={name}
              onChangeText={setName}
            />

            <View style={styles.row}>
              <View style={styles.halfLeft}>
                <InputField
                  label="Şehir"
                  icon="map-marker"
                  placeholder="Örn: İstanbul"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={styles.halfRight}>
                <InputField
                  label="Katılımcı Sayısı"
                  icon="soccer"
                  placeholder="Örn: 12"
                  value={participantCountStr}
                  onChangeText={setParticipantCountStr}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <InputField
              label="Lokasyon Adı"
              icon="map-marker"
              placeholder="Örn: Atatürk Olimpiyat Stadyumu"
              value={locationName}
              onChangeText={setLocationName}
            />

            <View style={styles.row}>
              <View style={styles.halfLeft}>
                <InputField
                  label="Başlangıç Tarihi"
                  icon="calendar"
                  placeholder="YYYY-MM-DD"
                  value={startDateStr}
                  onChangeText={setStartDateStr}
                />
              </View>
              <View style={styles.halfRight}>
                <InputField
                  label="Bitiş Tarihi"
                  icon="calendar"
                  placeholder="YYYY-MM-DD"
                  value={endDateStr}
                  onChangeText={setEndDateStr}
                />
              </View>
            </View>

            <SelectField
              label="Durum"
              options={TOURNAMENT_STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
            />

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                <MaterialCommunityIcons name="check" size={18} color="#fff" />
                <Text style={styles.saveText}>Turnuvayı Kaydet</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetScrollView>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  indicator: {
    backgroundColor: '#CBD5E1',
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: APP_COLORS.primary,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  halfLeft: {
    flex: 1,
    marginRight: 6,
  },
  halfRight: {
    flex: 1,
    marginLeft: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1.5,
    flexDirection: 'row',
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
