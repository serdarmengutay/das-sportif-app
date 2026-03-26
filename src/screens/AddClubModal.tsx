import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useClubs } from '../hooks/useClubs';
import type { AddClubModalProps } from '../types/navigation';

export const AddClubModal: React.FC<AddClubModalProps> = ({ route, navigation }) => {
  const { lat, lng } = route.params;
  const { addClub } = useClubs();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!name.trim()) return;
    
    await addClub({
      name: name.trim(),
      city: '',
      district: '',
      lat,
      lng,
      notes: notes.trim(),
      phone: '',
      status: 'visited',
    });
    
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Yeni Kulüp Ekle</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeBtn}>Kapat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Kulüp Adı</Text>
          <TextInput
            style={styles.input}
            placeholder="Kulüp adını giriniz..."
            placeholderTextColor="#78909c"
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <Text style={styles.label}>Koordinatlar</Text>
          <View style={styles.coordBox}>
            <Text style={styles.coordText}>{lat.toFixed(6)}, {lng.toFixed(6)}</Text>
          </View>

          <Text style={styles.label}>Notlar (Opsiyonel)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Eklemek istediğiniz notlar..."
            placeholderTextColor="#78909c"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity 
            style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]} 
            onPress={handleSave}
            disabled={!name.trim()}
          >
            <Text style={styles.saveBtnText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeBtn: {
    color: '#ff5252',
    fontSize: 16,
  },
  form: {
    gap: 16,
  },
  label: {
    color: '#4fc3f7',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#2a2a4e',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  coordBox: {
    backgroundColor: '#0f0f23',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#2a2a4e',
  },
  coordText: {
    color: '#78909c',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  saveBtn: {
    backgroundColor: '#4fc3f7',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnDisabled: {
    backgroundColor: '#78909c',
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
