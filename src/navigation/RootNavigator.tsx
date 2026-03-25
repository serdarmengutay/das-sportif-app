import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../types/navigation';
import { MapStack } from './MapStack';
import { ClubsStack } from './ClubsStack';
import { TournamentsStack } from './TournamentsStack';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#2a2a4e' },
      tabBarActiveTintColor: '#4fc3f7',
      tabBarInactiveTintColor: '#78909c',
    }}
  >
    <Tab.Screen
      name="MapTab"
      component={MapStack}
      options={{
        tabBarLabel: 'Harita',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🗺️</Text>,
      }}
    />
    <Tab.Screen
      name="ClubsTab"
      component={ClubsStack}
      options={{
        tabBarLabel: 'Kulüpler',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚽</Text>,
      }}
    />
    <Tab.Screen
      name="TournamentsTab"
      component={TournamentsStack}
      options={{
        tabBarLabel: 'Turnuvalar',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏆</Text>,
      }}
    />
  </Tab.Navigator>
);
