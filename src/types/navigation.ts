import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { SCREENS, TABS } from '../constants/screenConstants';

// ─── Stack Param Lists ────────────────────────────────────

export type RootStackParamList = {
  [SCREENS.SPLASH]: undefined;
  [SCREENS.MAIN_TABS]: NavigatorScreenParams<BottomTabParamList>;
  [SCREENS.CLUB_DETAIL]: { clubId: string };
  [SCREENS.TOURNAMENT_DETAIL]: { tournamentId: string };
  [SCREENS.ADD_CLUB_MODAL]: { lat: number; lng: number };
};

export type BottomTabParamList = {
  [TABS.MAP]: undefined;
  [TABS.CLUBS]: undefined;
  [TABS.TOURNAMENTS]: undefined;
};

// ─── Screen Props ─────────────────────────────────────────

export type SplashScreenProps = NativeStackScreenProps<RootStackParamList, typeof SCREENS.SPLASH>;

export type ClubDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof SCREENS.CLUB_DETAIL
>;

export type TournamentDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof SCREENS.TOURNAMENT_DETAIL
>;

export type AddClubModalProps = NativeStackScreenProps<
  RootStackParamList,
  typeof SCREENS.ADD_CLUB_MODAL
>;

// ─── Tab Screen Props (Composite) ─────────────────────────

export type MapScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, typeof TABS.MAP>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ClubsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, typeof TABS.CLUBS>,
  NativeStackScreenProps<RootStackParamList>
>;

export type TournamentsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, typeof TABS.TOURNAMENTS>,
  NativeStackScreenProps<RootStackParamList>
>;
