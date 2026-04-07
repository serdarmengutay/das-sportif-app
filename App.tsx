import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Router } from "./src/router/Router";
import { initDatabase } from "./src/services/database";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SafeView from "./src/components/SafeView";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useClubStore } from "./src/store/useClubStore";
import { useTournamentStore } from "./src/store/useTournamentStore";
import { useClubTournamentStore } from "./src/store/useClubTournamentStore";

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const startup = async () => {
      try {
        await initDatabase();

        // Load initial data into stores
        const { loadClubs } = useClubStore.getState();
        const { loadTournaments } = useTournamentStore.getState();
        const { loadRelations } = useClubTournamentStore.getState();

        await Promise.all([loadClubs(), loadTournaments(), loadRelations()]);

        setDbReady(true);
        // Start background sync
        import("./src/services/syncService").then(({ syncData }) => {
          syncData();
        });
      } catch (err) {
        console.error("Database init error:", err);
      }
    };
    startup();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <StatusBar style="dark" />
          {!dbReady ? (
            <SafeView
              style={{ justifyContent: "center", backgroundColor: "#1a1a2e" }}
            >
              <ActivityIndicator size="large" color="#4fc3f7" />
            </SafeView>
          ) : (
            <Router />
          )}
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
