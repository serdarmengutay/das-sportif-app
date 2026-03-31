import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { APP_COLORS } from '../styles/colors';
import { ClubEditForm } from './ClubEditForm';
import { useClubStore } from '../store/useClubStore';
import { SCREENS } from '../constants/screenConstants';
import { useAppNavigation } from '../hooks/useGlobal/useAppNavigation';
import type { Club, ClubStatus } from '../types';

const STATUS_LABELS: Record<ClubStatus, string> = {
  visited: 'ZİYARET EDİLDİ',
  proposal: 'TEKLİF',
  negotiation: 'GÖRÜŞME',
  deal: 'ANLAŞMA',
};

const STATUS_COLORS: Record<ClubStatus, string> = {
  visited: '#66bb6a',
  proposal: '#ffa726',
  negotiation: '#42a5f5',
  deal: '#ab47bc',
};

type Props = {
  club: Club | null;
  onDismiss: () => void;
};

export const ClubBottomSheet: React.FC<Props> = ({ club, onDismiss }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigation = useAppNavigation();
  const updateClub = useClubStore((s) => s.updateClub);

  const snapPoints = useMemo(() => ['40%', '85%'], []);

  // Club değiştiğinde sheet'i aç ve edit modunu kapat
  useEffect(() => {
    if (club) {
      setIsEditMode(false);
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [club]);

  const handleEditPress = useCallback(() => {
    setIsEditMode(true);
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditMode(false);
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleSave = useCallback(
    async (data: { status: ClubStatus; notes: string; coachPhone: string }) => {
      if (!club) return;
      await updateClub(club.id, data);
      setIsEditMode(false);
      bottomSheetRef.current?.snapToIndex(0);
    },
    [club, updateClub],
  );

  const handleViewDetails = useCallback(() => {
    if (!club) return;
    onDismiss();
    navigation.navigate(SCREENS.CLUB_DETAIL, { clubId: club.id });
  }, [club, navigation, onDismiss]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        setIsEditMode(false);
        onDismiss();
      }
    },
    [onDismiss],
  );

  if (!club) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      enablePanDownToClose
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.sheetContent}>
        {isEditMode ? (
          <ClubEditForm
            club={club}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        ) : (
          <DetailView
            club={club}
            onEdit={handleEditPress}
            onViewDetails={handleViewDetails}
          />
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

// ─── Detail View (alt bileşen) ─────────────────────────────

type DetailViewProps = {
  club: Club;
  onEdit: () => void;
  onViewDetails: () => void;
};

const DetailView: React.FC<DetailViewProps> = ({ club, onEdit, onViewDetails }) => (
  <View style={styles.detailContainer}>
    {/* Status Badge */}
    <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[club.status] }]}>
      <Text style={styles.statusBadgeText}>{STATUS_LABELS[club.status]}</Text>
    </View>

    {/* Club Name + Image */}
    <View style={styles.headerRow}>
      <View style={styles.headerTexts}>
        <Text style={styles.clubName}>{club.name}</Text>
        {(club.city || club.district) && (
          <Text style={styles.location}>
            📍 {club.district ? `${club.district}, ` : ''}
            {club.city}
          </Text>
        )}
      </View>
      <View style={styles.clubImageContainer}>
        <Text style={styles.clubImagePlaceholder}>⚽</Text>
      </View>
    </View>

    {/* Info Cards */}
    {club.coachPhone ? (
      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>TELEFON</Text>
          <Text style={styles.infoValue}>{club.coachPhone}</Text>
        </View>
      </View>
    ) : null}

    {/* Action Buttons */}
    <View style={styles.actionRow}>
      <TouchableOpacity style={styles.editPinBtn} onPress={onEdit}>
        <Text style={styles.editPinBtnText}>📝 DÜZENLE</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.updateStatusBtn} onPress={onEdit}>
        <Text style={styles.updateStatusBtnText}>⇆ DURUMU GÜNCELLE</Text>
      </TouchableOpacity>
    </View>

    {/* View Details Button */}
    <TouchableOpacity style={styles.detailsBtn} onPress={onViewDetails}>
      <Text style={styles.detailsBtnText}>DETAYLARI GÖR →</Text>
    </TouchableOpacity>
  </View>
);

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
  detailContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTexts: {
    flex: 1,
    marginRight: 12,
  },
  clubName: {
    fontSize: 24,
    fontWeight: '800',
    color: APP_COLORS.primary,
    lineHeight: 30,
  },
  location: {
    color: '#78909c',
    fontSize: 13,
    marginTop: 6,
  },
  clubImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubImagePlaceholder: {
    fontSize: 28,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 14,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#78909c',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  editPinBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  editPinBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  updateStatusBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: APP_COLORS.secondary,
    alignItems: 'center',
  },
  updateStatusBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  detailsBtn: {
    backgroundColor: APP_COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  detailsBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
