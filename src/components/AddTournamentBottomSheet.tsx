import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { APP_COLORS } from '../styles/colors';
import { useTournamentStore } from '../store/useTournamentStore';
import type { TournamentStatus } from '../types';

type Props = {
  onDismiss?: () => void;
};

export const AddTournamentBottomSheet = forwardRef<BottomSheet, Props>(({ onDismiss }, ref) => {
  const addTournament = useTournamentStore((s) => s.addTournament);
  const snapPoints = useMemo(() => ['50%', '85%'], []);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [locationName, setLocationName] = useState('');
  const [startDateStr, setStartDateStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');
  const [participantCountStr, setParticipantCountStr] = useState('');
  const [status, setStatus] = useState<TournamentStatus>('planned');

  const resetForm = useCallback(() => {
    setName('');
    setCity('');
    setLocationName('');
    setStartDateStr('');
    setEndDateStr('');
    setParticipantCountStr('');
    setStatus('planned');
  }, []);

  const handleSave = useCallback(async () => {
    if (!name.trim() || !city.trim() || !locationName.trim()) {
      return; // Simple validation
    }

    const startDate = startDateStr ? new Date(startDateStr).getTime() : null;
    const endDate = endDateStr ? new Date(endDateStr).getTime() : null;
    const participantCount = parseInt(participantCountStr, 10) || 0;

    await addTournament({
      name,
      city,
      locationName,
      startDate: isNaN(startDate as number) ? null : startDate,
      endDate: isNaN(endDate as number) ? null : endDate,
      status,
      participantCount,
    });

    resetForm();
    if (typeof ref !== 'function' && ref?.current) {
      ref.current.close();
    }
  }, [name, city, locationName, startDateStr, endDateStr, status, participantCountStr, addTournament, resetForm, ref]);

  const handleCancel = useCallback(() => {
    resetForm();
    if (typeof ref !== 'function' && ref?.current) {
      ref.current.close();
    }
    if (onDismiss) onDismiss();
  }, [ref, resetForm, onDismiss]);

  const handleSheetChange = useCallback((index: number) => {
    if (index === -1 && onDismiss) {
      onDismiss();
    }
  }, [onDismiss]);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={handleSheetChange}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetScrollView style={styles.sheetContent} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Yeni Turnuva Ekle</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>TURNUVA ADI</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Örn: Elite Pro Cup 2024"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>ŞEHİR</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Örn: İstanbul"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>KATILIMCI SAYISI</Text>
            <TextInput
              style={styles.input}
              value={participantCountStr}
              onChangeText={setParticipantCountStr}
              placeholder="Örn: 12"
              keyboardType="number-pad"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>LOKASYON (Tesis Adı vb.)</Text>
          <TextInput
            style={styles.input}
            value={locationName}
            onChangeText={setLocationName}
            placeholder="Örn: Atatürk Olimpiyat Stadyumu"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>BAŞLANGIÇ TARİHİ</Text>
            <TextInput
              style={styles.input}
              value={startDateStr}
              onChangeText={setStartDateStr}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>BİTİŞ TARİHİ</Text>
            <TextInput
              style={styles.input}
              value={endDateStr}
              onChangeText={setEndDateStr}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>DURUM</Text>
          <View style={styles.statusButtonsRow}>
            {(['planned', 'active', 'completed'] as TournamentStatus[]).map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusButton,
                  status === s && styles.statusButtonActive,
                ]}
                onPress={() => setStatus(s)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    status === s && styles.statusButtonTextActive,
                  ]}
                >
                  {s === 'planned' ? 'PLANLANDI' : s === 'active' ? 'AKTİF' : 'TAMAMLANDI'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>İPTAL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>KAYDET</Text>
          </TouchableOpacity>
        </View>

      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  indicator: {
    backgroundColor: '#ccc',
    width: 40,
  },
  sheetContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: APP_COLORS.primary,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  row: {
    flexDirection: 'row',
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusButtonActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#38BDF8',
  },
  statusButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  statusButtonTextActive: {
    color: '#0284C7',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
