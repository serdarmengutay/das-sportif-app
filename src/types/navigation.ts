import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// ─── Stack Param Lists ────────────────────────────────────

export type MapStackParamList = {
  MapMain: undefined;
};

export type ClubsStackParamList = {
  ClubsList: undefined;
  ClubDetail: { clubId: string };
};

export type TournamentsStackParamList = {
  TournamentsList: undefined;
  TournamentDetail: { tournamentId: string };
};

// ─── Bottom Tab ───────────────────────────────────────────

export type RootTabParamList = {
  MapTab: NavigatorScreenParams<MapStackParamList>;
  ClubsTab: NavigatorScreenParams<ClubsStackParamList>;
  TournamentsTab: NavigatorScreenParams<TournamentsStackParamList>;
};

// ─── Screen Props ─────────────────────────────────────────

export type MapScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MapStackParamList, 'MapMain'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type ClubsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ClubsStackParamList, 'ClubsList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type ClubDetailScreenProps = NativeStackScreenProps<ClubsStackParamList, 'ClubDetail'>;

export type TournamentsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<TournamentsStackParamList, 'TournamentsList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type TournamentDetailScreenProps = NativeStackScreenProps<
  TournamentsStackParamList,
  'TournamentDetail'
>;
