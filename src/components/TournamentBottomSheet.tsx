import React, { forwardRef, useCallback, useMemo, useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { APP_COLORS } from "../styles/colors";
import { StatusBadge } from "./StatusBadge";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";
import { useTournamentStore } from "../store/useTournamentStore";
import { getTournamentStatusConfig, TOURNAMENT_STATUS_OPTIONS } from "../utils/statusUtils";
import { formatDate } from "../utils/dateUtils";
import type { Tournament, TournamentStatus } from "../types";

type Props = {
  tournament: Tournament | null;
  onDismiss: () => void;
};

// TOURNAMENT_STATUS_OPTIONS statusUtils'ten alınıyor.

export const TournamentBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ tournament, onDismiss }, ref) => {
    const { updateTournament } = useTournamentStore();
    const [isEditing, setIsEditing] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [locationName, setLocationName] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState<TournamentStatus>("planned");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Picker states
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    useEffect(() => {
      if (tournament) {
        setName(tournament.name);
        setCity(tournament.city || "");
        setLocationName(tournament.locationName || "");
        setNotes(tournament.notes || "");
        setStatus(tournament.status);
        setStartDate(tournament.startDate ? new Date(tournament.startDate) : null);
        setEndDate(tournament.endDate ? new Date(tournament.endDate) : null);
        setIsEditing(false);
      }
    }, [tournament]);

    const snapPoints = useMemo(() => (isEditing ? ["90%"] : ["50%", "70%"]), [isEditing]);

    const handleSave = async () => {
      if (!tournament) return;
      if (!name.trim()) {
        Alert.alert("Uyarı", "Turnuva adı boş bırakılamaz.");
        return;
      }

      try {
        await updateTournament(tournament.id, {
          name: name.trim(),
          city: city.trim(),
          locationName: locationName.trim(),
          notes: notes.trim(),
          status,
          startDate: startDate ? startDate.getTime() : null,
          endDate: endDate ? endDate.getTime() : null,
        });
        setIsEditing(false);
      } catch (err) {
        Alert.alert("Hata", "Güncelleme sırasında bir sorun oluştu.");
      }
    };

    const onStartDateChange = (event: any, selectedDate?: Date) => {
      setShowStartPicker(Platform.OS === 'ios');
      if (selectedDate) {
        setStartDate(selectedDate);
      }
    };

    const onEndDateChange = (event: any, selectedDate?: Date) => {
      setShowEndPicker(Platform.OS === 'ios');
      if (selectedDate) {
        setEndDate(selectedDate);
      }
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    if (!tournament) return null;

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onDismiss={onDismiss}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {isEditing ? (
            /* EDIT MODE */
            <View>
              <View style={styles.header}>
                <Text style={styles.editTitle}>Turnuva Düzenle</Text>
                <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.closeBtn}>
                  <MaterialCommunityIcons name="close" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              <InputField
                label="Turnuva Adı"
                icon="trophy-outline"
                value={name}
                onChangeText={setName}
                placeholder="Turnuva adı giriniz..."
              />
              
              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <InputField
                    label="Şehir"
                    icon="map-marker-outline"
                    value={city}
                    onChangeText={setCity}
                    placeholder="Şehir..."
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <SelectField
                    label="Durum"
                    value={status}
                    onChange={setStatus}
                    options={TOURNAMENT_STATUS_OPTIONS}
                  />
                </View>
              </View>

              <InputField
                label="Lokasyon"
                icon="stadium-variant"
                value={locationName}
                onChangeText={setLocationName}
                placeholder="Lokasyon/Saha adı giriniz..."
              />

              <View style={styles.formRow}>
                <TouchableOpacity 
                   style={styles.datePickerTrigger} 
                   onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.fieldLabel}>BAŞLANGIÇ</Text>
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
                  <Text style={styles.fieldLabel}>BİTİŞ</Text>
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
                label="Notlar"
                icon="note-text-outline"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                placeholder="Turnuva notları..."
              />

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
                <MaterialCommunityIcons name="check" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>GÜNCELLE</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* VIEW MODE */
            <View>
              <View style={styles.header}>
                <View style={styles.titleGroup}>
                  <Text style={styles.clubName} numberOfLines={1}>
                    {tournament.name}
                  </Text>
                  <View style={styles.locationRow}>
                    <MaterialCommunityIcons name="map-marker" size={14} color="#64748b" />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {tournament.city}{tournament.locationName ? ` · ${tournament.locationName}` : ""}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoSection}>
                <StatusBadge config={getTournamentStatusConfig(tournament.status)} />
                <View style={styles.dateViewRow}>
                  <View style={styles.dateInfoBox}>
                    <MaterialCommunityIcons name="calendar-start" size={18} color={APP_COLORS.primary} />
                    <View>
                      <Text style={styles.infoLabel}>BAŞLANGIÇ</Text>
                      <Text style={styles.infoValue}>{formatDate(tournament.startDate)}</Text>
                    </View>
                  </View>
                  <View style={styles.dateInfoBox}>
                    <MaterialCommunityIcons name="calendar-end" size={18} color={APP_COLORS.primary} />
                    <View>
                      <Text style={styles.infoLabel}>BİTİŞ</Text>
                      <Text style={styles.infoValue}>{formatDate(tournament.endDate)}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <MaterialCommunityIcons name="soccer" size={20} color={APP_COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>KATILIMCI SAYISI</Text>
                    <Text style={styles.infoValue}>{tournament.participantCount} Takım</Text>
                  </View>
                </View>

                <View style={styles.notesBox}>
                  <View style={styles.notesHeader}>
                    <MaterialCommunityIcons name="note-text-outline" size={16} color="#64748b" />
                    <Text style={styles.notesLabel}>NOTLAR</Text>
                  </View>
                  <Text style={styles.notesText}>
                    {tournament.notes || "Henüz bir not eklenmemiş."}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  indicator: {
    backgroundColor: "#e2e8f0",
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleGroup: {
    flex: 1,
    marginRight: 12,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  clubName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  editTriggerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 20,
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateViewRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  dateInfoBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  notesBox: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 1,
  },
  notesText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  formRow: {
    flexDirection: "row",
    gap: 0,
    marginBottom: 16,
  },
  datePickerTrigger: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: 6,
  },
  dateValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateInputText: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: APP_COLORS.primary,
    flexDirection: "row",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
