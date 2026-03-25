import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MapStackParamList } from '../types/navigation';
import { MapScreen } from '../screens/MapScreen';

const Stack = createNativeStackNavigator<MapStackParamList>();

export const MapStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MapMain" component={MapScreen} />
  </Stack.Navigator>
);
