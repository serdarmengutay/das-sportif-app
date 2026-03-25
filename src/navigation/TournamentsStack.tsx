import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { TournamentsStackParamList } from "../types/navigation";
import { TournamentsScreen } from "../screens/TournamentsScreen";
import { TournamentDetailScreen } from "../screens/TournamentDetailScreen";

const Stack = createNativeStackNavigator<TournamentsStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: "#1a1a2e" },
  headerTintColor: "#e0e0e0",
};

export const TournamentsStack: React.FC = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen
      name="TournamentsList"
      component={TournamentsScreen}
      options={{ title: "Turnuvalar" }}
    />
    <Stack.Screen
      name="TournamentDetail"
      component={TournamentDetailScreen}
      options={{ title: "Turnuva Detay" }}
    />
  </Stack.Navigator>
);
