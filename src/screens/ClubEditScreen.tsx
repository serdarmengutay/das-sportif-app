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
import { useClubStore } from "../store/useClubStore";
import { APP_COLORS } from "../styles/colors";
import { SCREENS, TABS } from "../constants/screenConstants";
import { InputField } from "../components/InputField";
import { SelectField } from "../components/SelectField";
import { CLUB_STATUS_OPTIONS } from "../utils/statusUtils";
import { getCityAndDistrictFromCoords } from "../utils/getCityAndDistrictFromCoords";
import type { ClubEditScreenProps } from "../types/navigation";
import type { ClubStatus } from "../types";

export const ClubEditScreen: React.FC<ClubEditScreenProps> = ({ navigation, route }) => {
  const { clubId, lat: newLat, lng: newLng } = route.params;
  const { clubs, updateClub } = useClubStore();
  const club = clubs.find((c) => c.id === clubId);

  // Form State
  const [name, setName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [coachPhone, setCoachPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<ClubStatus>("visited");
  
  // Location State
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  
  const [saving, setSaving] = useState(false);

  // Initial Load (Pre-fill)
  useEffect(() => {
    if (club) {
      setName(club.name);
      setCoachName(club.coachName || "");
      setCoachPhone(club.coachPhone || "");
      setNotes(club.notes || "");
      setStatus(club.status);
      setLat(club.lat);
      setLng(club.lng);
      setCity(club.city || "");
      setDistrict(club.district || "");
    }
  }, [club]);

  // Handle Location Return from Map
  useEffect(() => {
    if (newLat && newLng) {
      setLat(newLat);
      setLng(newLng);
      getCityAndDistrictFromCoords(newLat, newLng).then((geo) => {
        setCity(geo.city);
        setDistrict(geo.district);
      });
    }
  }, [newLat, newLng]);

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert("Uyarı", "Kulüp adı zorunludur.");
      return;
    }

    setSaving(true);
    try {
      await updateClub(clubId, {
        name: name.trim(),
        coachName: coachName.trim(),
        coachPhone: coachPhone.trim(),
        notes: notes.trim(),
        status,
        lat,
        lng,
        city,
        district,
      });
      navigation.goBack();
    } catch (err) {
      console.warn("Kulüp güncellenemedi:", err);
      Alert.alert("Hata", "Kulüp güncellenirken bir sorun oluştu.");
    } finally {
      setSaving(false);
    }
  }, [clubId, name, coachName, coachPhone, notes, status, lat, lng, city, district, updateClub, navigation]);

  if (!club) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text>Kulüp bulunamadı.</Text>
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
            <Text style={styles.headerTitle}>Kulübü Düzenle</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Location Card (Read Only) */}
          <View style={styles.locationReadOnlyCard}>
             <View style={styles.locationInfo}>
                <View style={styles.locationIconBg}>
                   <MaterialCommunityIcons name="map-marker" size={20} color="#64748b" />
                </View>
                <View style={{ flex: 1 }}>
                   <Text style={[styles.locationLabel, { color: '#94a3b8' }]}>Mevcut Konum</Text>
                   <Text style={[styles.locationText, { color: '#64748b' }]}>
                      {district ? `${district}, ` : ""}{city || "Konum bilgisi yok"}
                   </Text>
                </View>
             </View>
             <View style={styles.locationAlert}>
                <MaterialCommunityIcons name="information-outline" size={14} color="#94a3b8" />
                <Text style={styles.locationAlertText}>Konum şu an düzenlenemez</Text>
             </View>
          </View>

          {/* Form Fields */}
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
            placeholder="Sorumlu adı soyadı giriniz..."
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
            label="Görüşme Notları"
            icon="note-text"
            placeholder="Kulüp hakkında not giriniz..."
            value={notes}
            onChangeText={setNotes}
            multiline
            style={{ textAlignVertical: "top" }}
          />

          <SelectField
            label="Mevcut Durum"
            options={CLUB_STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
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
                <Text style={styles.saveBtnText}>Kaydet</Text>
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
  locationReadOnlyCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
  locationAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  locationAlertText: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
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
