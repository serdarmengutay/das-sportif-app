import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTournamentStore } from "../store/useTournamentStore";
import { APP_COLORS } from "../styles/colors";
import { SCREENS } from "../constants/screenConstants";
import { InputField } from "../components/InputField";
import { SelectField } from "../components/SelectField";
import { formatDate } from "../utils/dateUtils";
import { TOURNAMENT_STATUS_OPTIONS } from "../utils/statusUtils";
import type { TournamentEditScreenProps } from "../types/navigation";
import type { TournamentStatus } from "../types";

// TOURNAMENT_STATUS_OPTIONS statusUtils'ten alınıyor.

export const TournamentEditScreen: React.FC<TournamentEditScreenProps> = ({ navigation, route }) => {
  const { tournamentId } = route.params;
  const { tournaments, updateTournament } = useTournamentStore();
  const tournament = tournaments.find((t) => t.id === tournamentId);

  // Form State
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [locationName, setLocationName] = useState("");
  const [participantCount, setParticipantCount] = useState("");
  const [status, setStatus] = useState<TournamentStatus>("planned");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Picker States
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  const [saving, setSaving] = useState(false);

  // Load Data
  useEffect(() => {
    if (tournament) {
      setName(tournament.name);
      setCity(tournament.city || "");
      setLocationName(tournament.locationName || "");
      setParticipantCount(tournament.participantCount.toString());
      setStatus(tournament.status);
      setNotes(tournament.notes || "");
      setStartDate(tournament.startDate ? new Date(tournament.startDate) : null);
      setEndDate(tournament.endDate ? new Date(tournament.endDate) : null);
    }
  }, [tournament]);

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) setEndDate(selectedDate);
  };

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert("Uyarı", "Turnuva adı zorunludur.");
      return;
    }

    setSaving(true);
    try {
      await updateTournament(tournamentId, {
        name: name.trim(),
        city: city.trim(),
        locationName: locationName.trim(),
        participantCount: parseInt(participantCount, 10) || 0,
        status,
        notes: notes.trim(),
        startDate: startDate ? startDate.getTime() : null,
        endDate: endDate ? endDate.getTime() : null,
      });
      navigation.goBack();
    } catch (err) {
      console.warn("Turnuva güncellenemedi:", err);
      Alert.alert("Hata", "Turnuva güncellenirken bir sorun oluştu.");
    } finally {
      setSaving(false);
    }
  }, [tournamentId, name, city, locationName, participantCount, status, notes, startDate, endDate, updateTournament, navigation]);

  if (!tournament) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text>Turnuva bulunamadı.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Turnuvayı Düzenle</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Form Fields */}
          <InputField
            label="Turnuva Adı"
            icon="trophy-outline"
            placeholder="Turnuva adı giriniz..."
            value={name}
            onChangeText={setName}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <InputField
                label="Şehir"
                icon="map-marker-outline"
                placeholder="Şehir..."
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <InputField
                label="Katılımcı Sayısı"
                icon="soccer"
                placeholder="Takım sayısı..."
                value={participantCount}
                onChangeText={setParticipantCount}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <InputField
            label="Lokasyon / Saha Adı"
            icon="stadium-variant"
            placeholder="Saha adı giriniz..."
            value={locationName}
            onChangeText={setLocationName}
          />

          <SelectField
            label="Turnuva Durumu"
            options={TOURNAMENT_STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
          />

          <View style={styles.row}>
            <TouchableOpacity 
              style={styles.datePickerTrigger} 
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.fieldLabel}>BAŞLANGIÇ TARİHİ</Text>
              <View style={styles.dateValueRow}>
                <MaterialCommunityIcons name="calendar-start" size={18} color={APP_COLORS.primary} />
                <Text style={styles.dateInputText}>
                  {startDate ? formatDate(startDate.getTime()) : "Seçiniz..."}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.datePickerTrigger} 
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.fieldLabel}>BİTİŞ TARİHİ</Text>
              <View style={styles.dateValueRow}>
                <MaterialCommunityIcons name="calendar-end" size={18} color={APP_COLORS.primary} />
                <Text style={styles.dateInputText}>
                  {endDate ? formatDate(endDate.getTime()) : "Seçiniz..."}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={onStartDateChange}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={onEndDateChange}
            />
          )}

          <InputField
            label="Detaylı Notlar"
            icon="note-text-outline"
            placeholder="Turnuva hakkında not giriniz..."
            value={notes}
            onChangeText={setNotes}
            multiline
            style={{ textAlignVertical: "top" }}
          />

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
              disabled={saving}
            >
              <Text style={styles.cancelBtnText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Text style={styles.saveBtnText}>Kaydediliyor...</Text>
              ) : (
                <Text style={styles.saveBtnText}>Değişiklikleri Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_COLORS.light_bg,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  datePickerTrigger: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginHorizontal: 4,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dateValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateInputText: {
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "700",
  },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: APP_COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
