import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ClubsStackParamList } from "../types/navigation";
import { ClubsScreen } from "../screens/ClubsScreen";
import { ClubDetailScreen } from "../screens/ClubDetailScreen";

const Stack = createNativeStackNavigator<ClubsStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: "#1a1a2e" },
  headerTintColor: "#e0e0e0",
};

export const ClubsStack: React.FC = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen
      name="ClubsList"
      component={ClubsScreen}
      options={{ title: "Kulüpler" }}
    />
    <Stack.Screen
      name="ClubDetail"
      component={ClubDetailScreen}
      options={{ title: "Kulüp Detay" }}
    />
  </Stack.Navigator>
);
