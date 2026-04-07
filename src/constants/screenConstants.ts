export const SCREENS = {
  SPLASH: "Splash",
  MAIN_TABS: "MainTabs",
  CLUB_DETAIL: "ClubDetail",
  CLUB_EDIT: "ClubEdit",
  TOURNAMENT_DETAIL: "TournamentDetail",
  TOURNAMENT_EDIT: "TournamentEdit",
  ADD_CLUB_MODAL: "AddClubModal",
} as const;

export const TABS = {
  MAP: "MapTab",
  CLUBS: "ClubsTab",
  TOURNAMENTS: "TournamentsTab",
} as const;

export const TAB_NAMES = {
  MAP: "Harita" as string,
  CLUBS: "Kulüpler" as string,
  TOURNAMENTS: "Turnuvalar" as string,
} as const;

export type ScreenName = (typeof SCREENS)[keyof typeof SCREENS];
export type TabName = (typeof TABS)[keyof typeof TABS];
