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
import { APP_COLORS } from '../styles/colors';
import { useClubStore } from '../store/useClubStore';
import { getCityAndDistrictFromCoords } from '../utils/getCityAndDistrictFromCoords';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import type { ClubStatus } from '../types';

import { CLUB_STATUS_OPTIONS } from '../utils/statusUtils';

type Props = {
  lat: number;
  lng: number;
  onDismiss?: () => void;
};

export const AddClubBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ lat, lng, onDismiss }, ref) => {
    const addClub = useClubStore((s) => s.addClub);
    const snapPoints = useMemo(() => ['65%', '90%'], []);

    const [name, setName] = useState('');
    const [coachName, setCoachName] = useState('');
    const [coachPhone, setCoachPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<ClubStatus>('visited');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      if (lat && lng) {
        getCityAndDistrictFromCoords(lat, lng).then((geo) => {
          setCity(geo.city);
          setDistrict(geo.district);
        });
      }
    }, [lat, lng]);

    const resetForm = useCallback(() => {
      setName('');
      setCoachName('');
      setCoachPhone('');
      setNotes('');
      setStatus('visited');
    }, []);

    const closeSheet = useCallback(() => {
      if (typeof ref !== 'function' && ref?.current) {
        ref.current.dismiss();
      }
      onDismiss?.();
    }, [ref, onDismiss]);

    const handleSave = useCallback(async () => {
      if (!name.trim()) {
        Alert.alert('Uyarı', 'Kulüp adı zorunludur.');
        return;
      }

      setSaving(true);
      try {
        await addClub({
          name: name.trim(),
          city,
          district,
          lat,
          lng,
          notes: notes.trim(),
          status,
          coachPhone: coachPhone.trim(),
          coachName: coachName.trim(),
        });
        resetForm();
        closeSheet();
      } catch (err) {
        console.warn('Kulüp kaydedilemedi:', err);
        Alert.alert('Hata', 'Kulüp kaydedilirken bir sorun oluştu.');
      } finally {
        setSaving(false);
      }
    }, [name, city, district, lat, lng, notes, status, coachPhone, coachName, addClub, resetForm, closeSheet]);

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
                <Text style={styles.title}>Kulüp Ekle</Text>
                <Text style={styles.subtitle}>Kulüp bilgilerini gir</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={handleCancel}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Location Info */}
            {(city || district) ? (
              <View style={styles.locationBadge}>
                <MaterialCommunityIcons name="map-marker" size={16} color={APP_COLORS.secondary} />
                <Text style={styles.locationText}>
                  {district ? `${district}, ` : ''}{city}
                </Text>
              </View>
            ) : null}

            {/* Form */}
            <InputField
              label="Kulüp Adı"
              icon="text-box"
              placeholder="Kulüp adı giriniz..."
              value={name}
              onChangeText={setName}
            />

            <InputField
              label="Kulüp Sorumlusu"
              icon="account"
              placeholder="Sorumlu adı giriniz..."
              value={coachName}
              onChangeText={setCoachName}
            />

            <InputField
              label="Telefon Numarası"
              icon="phone"
              placeholder="Telefon numarası giriniz..."
              value={coachPhone}
              onChangeText={setCoachPhone}
              keyboardType="phone-pad"
            />

            <InputField
              label="Notlar"
              icon="note-text"
              placeholder="Kulüp hakkında not giriniz..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />

            <SelectField
              label="Durum"
              options={CLUB_STATUS_OPTIONS}
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
                <Text style={styles.saveText}>Kulübü Kaydet</Text>
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
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 16,
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
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
