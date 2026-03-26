import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { navigationRef } from '../utils/navigationService';
import { SCREENS, TABS } from '../constants/screenConstants';
import type { RootStackParamList, BottomTabParamList } from '../types/navigation';

// Screens
import { SplashScreen } from '../screens/Splash/SplashScreen';
import { ClubsScreen } from '../screens/ClubsScreen';
import { MapScreen } from '../screens/MapScreen';
import { TournamentsScreen } from '../screens/TournamentsScreen';
import { ClubDetailScreen } from '../screens/ClubDetailScreen';
import { TournamentDetailScreen } from '../screens/TournamentDetailScreen';
import { AddClubModal } from '../screens/AddClubModal';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#2a2a4e' },
      tabBarActiveTintColor: '#4fc3f7',
      tabBarInactiveTintColor: '#78909c',
    }}
  >
    <Tab.Screen
      name={TABS.MAP}
      component={MapScreen}
      options={{
        tabBarLabel: 'Harita',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🗺️</Text>,
      }}
    />
    <Tab.Screen
      name={TABS.CLUBS}
      component={ClubsScreen}
      options={{
        tabBarLabel: 'Kulüpler',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚽</Text>,
      }}
    />
    <Tab.Screen
      name={TABS.TOURNAMENTS}
      component={TournamentsScreen}
      options={{
        tabBarLabel: 'Turnuvalar',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏆</Text>,
      }}
    />
  </Tab.Navigator>
);

export const Router = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={SCREENS.SPLASH}
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#e0e0e0',
          headerTitleStyle: { fontWeight: 'bold' },
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
          options={{ title: 'Kulüp Detay' }} 
        />
        <Stack.Screen 
          name={SCREENS.TOURNAMENT_DETAIL} 
          component={TournamentDetailScreen} 
          options={{ title: 'Turnuva Detay' }} 
        />

        {/* Modals */}
        <Stack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
          <Stack.Screen 
            name={SCREENS.ADD_CLUB_MODAL} 
            component={AddClubModal} 
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
