import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { DefaultTheme } from "@react-navigation/native";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

import { navigationRef } from "../utils/navigationService";
import { SCREENS, TAB_NAMES, TABS } from "../constants/screenConstants";
import type {
  RootStackParamList,
  BottomTabParamList,
} from "../types/navigation";

// Screens
import { SplashScreen } from "../screens/Splash/SplashScreen";
import { ClubsScreen } from "../screens/ClubsScreen";
import { MapScreen } from "../screens/MapScreen";
import { TournamentsScreen } from "../screens/TournamentsScreen";
import { ClubDetailScreen } from "../screens/ClubDetailScreen";
import { TournamentDetailScreen } from "../screens/TournamentDetailScreen";
import { AddClubModal } from "../screens/AddClubModal";
import { APP_COLORS } from "../styles/colors";
import {
  calculateBottomInset,
  isIOS,
  screenWidth,
} from "../constants/appConstants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const MainTabs = () => {
  const insets = useSafeAreaInsets();

  const PaddingTopCalculate = () => {
    return calculateBottomInset({
      insets: insets,
      iOSExtraInset: insets.bottom / 1.7 === 0 ? 20 : insets.bottom / 1.7, // iphone se gibi telefonlarda bottom insets 0 olabiliyor.
      androidExtraInset: screenWidth * 0.05,
      useIOSDeviceInset: false,
      useAndroidDeviceInset: false,
    });
  };

  const BottomTabsButtonHandler = (props: BottomTabBarButtonProps) => {
    return (
      <TouchableOpacity
        onPress={props.onPress}
        activeOpacity={1}
        style={props.style}
      >
        {props.children}
      </TouchableOpacity>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          alignItems: "center",
          justifyContent: "space-evenly",
          height: 95,
          backgroundColor: APP_COLORS.background,
          width: screenWidth,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.8,
          shadowRadius: 3.62,
          elevation: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0,
          paddingTop: PaddingTopCalculate(),
          paddingHorizontal: screenWidth * 0.04, // bottom tabs butonlarının arasındaki boşluğu azaltır.
        },
        tabBarActiveTintColor: APP_COLORS.secondary,
        tabBarInactiveTintColor: APP_COLORS.tertiary,
      }}
    >
      <Tab.Screen
        name={TAB_NAMES.MAP as any}
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBar_container}>
              <MaterialCommunityIcons
                name={focused ? "map-search" : "map-search-outline"}
                size={24}
                color={focused ? APP_COLORS.secondary : APP_COLORS.tertiary}
              />
            </View>
          ),
          tabBarButton: (props) => <BottomTabsButtonHandler {...props} />,
        }}
      />

      <Tab.Screen
        name={TAB_NAMES.CLUBS as any}
        component={ClubsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBar_container}>
              <MaterialCommunityIcons
                name={focused ? "soccer" : "soccer"}
                size={24}
                color={focused ? APP_COLORS.secondary : APP_COLORS.tertiary}
              />
            </View>
          ),
          tabBarButton: (props) => <BottomTabsButtonHandler {...props} />,
        }}
      />

      <Tab.Screen
        name={TAB_NAMES.TOURNAMENTS as any}
        component={TournamentsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBar_container}>
              <MaterialCommunityIcons
                name={focused ? "trophy" : "trophy-outline"}
                size={24}
                color={focused ? APP_COLORS.secondary : APP_COLORS.tertiary}
              />
            </View>
          ),
          tabBarButton: (props) => <BottomTabsButtonHandler {...props} />,
        }}
      />
    </Tab.Navigator>
  );
};
export const Router = () => {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: APP_COLORS.primary,
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: APP_COLORS.primary }}>
      <NavigationContainer ref={navigationRef} theme={MyTheme}>
        <Stack.Navigator
          initialRouteName={SCREENS.SPLASH}
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: APP_COLORS.primary,
            },
          }}
        >
          {/* Main Flow */}
          <Stack.Screen
            name={SCREENS.SPLASH}
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREENS.MAIN_TABS}
            component={MainTabs}
            options={{ headerShown: false }}
          />

          {/* Global Screens */}
          <Stack.Screen
            name={SCREENS.CLUB_DETAIL}
            component={ClubDetailScreen}
            options={{ title: "Kulüp Detay" }}
          />
          <Stack.Screen
            name={SCREENS.TOURNAMENT_DETAIL}
            component={TournamentDetailScreen}
            options={{ title: "Turnuva Detay" }}
          />

          {/* Modals */}
          <Stack.Group
            screenOptions={{ presentation: "modal", headerShown: false }}
          >
            <Stack.Screen
              name={SCREENS.ADD_CLUB_MODAL}
              component={AddClubModal}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar_container: {
    justifyContent: "center",
    alignItems: "center",
    width: isIOS ? screenWidth * 0.18 : screenWidth * 0.2,
    alignSelf: "center",
    flex: 1,
    gap: 4,
  },
});
