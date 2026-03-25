import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initDatabase } from './src/services/database';
import { useClubStore } from './src/store/useClubStore';
import { useTournamentStore } from './src/store/useTournamentStore';
import { useClubTournamentStore } from './src/store/useClubTournamentStore';

export default function App() {
  useEffect(() => {
    const bootstrap = async () => {
      await initDatabase();
      // Store'ları paralel yükle
      await Promise.all([
        useClubStore.getState().loadClubs(),
        useTournamentStore.getState().loadTournaments(),
        useClubTournamentStore.getState().loadRelations(),
      ]);
    };

    bootstrap().catch((err) => console.warn('Başlatma hatası:', err));
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <RootNavigator />
    </NavigationContainer>
  );
}
