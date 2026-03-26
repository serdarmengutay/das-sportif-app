import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { APP_COLORS } from '../styles/colors';
import type { Club, ClubStatus } from '../types';

const STATUS_OPTIONS: { value: ClubStatus; label: string; color: string }[] = [
  { value: 'visited', label: '✅ Ziyaret Edildi', color: '#66bb6a' },
  { value: 'proposal', label: '📋 Teklif', color: '#ffa726' },
  { value: 'negotiation', label: '🤝 Görüşme', color: '#42a5f5' },
  { value: 'deal', label: '🏆 Anlaşma', color: '#ab47bc' },
];

type Props = {
  club: Club;
  onSave: (data: { status: ClubStatus; notes: string; phone: string }) => void;
  onCancel: () => void;
};

export const ClubEditForm: React.FC<Props> = ({ club, onSave, onCancel }) => {
  const [status, setStatus] = useState<ClubStatus>(club.status);
  const [notes, setNotes] = useState(club.notes);
  const [phone, setPhone] = useState(club.phone);

  const handleSave = () => {
    onSave({ status, notes: notes.trim(), phone: phone.trim() });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Status Dropdown */}
      <Text style={styles.label}>DURUM SEÇİMİ</Text>
      <View style={styles.statusGroup}>
        {STATUS_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.statusOption,
              status === opt.value && { borderColor: opt.color, backgroundColor: `${opt.color}15` },
            ]}
            onPress={() => setStatus(opt.value)}
          >
            <Text
              style={[
                styles.statusOptionText,
                status === opt.value && { color: opt.color, fontWeight: '700' },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes */}
      <Text style={styles.label}>HIZLI NOTLAR</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Kulüp hakkında not ekleyin..."
        placeholderTextColor="#78909c"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Phone */}
      <Text style={styles.label}>TELEFON</Text>
      <TextInput
        style={styles.input}
        placeholder="0(5XX) XXX XX XX"
        placeholderTextColor="#78909c"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>İptal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>DURUMU GÜNCELLE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  label: {
    color: '#78909c',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 20,
  },
  statusGroup: {
    gap: 8,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  statusOptionText: {
    fontSize: 15,
    color: '#333',
  },
  textArea: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#78909c',
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: APP_COLORS.secondary,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
