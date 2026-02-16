// 📍 FILE: app/(tabs)/_layout.tsx
import { Colors } from "@/constants/theme";
import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme, View } from "react-native";

import AudioNotesHeader from "@/components/AudioNotesHeader";
import PersistentSearchBar from "@/components/PersistentSearchBar";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: themeColors.tint,
          // ✅ FIX: Render your custom header HERE, safely inside Expo's ecosystem
          header: () => <AudioNotesHeader />,
          // Hide the default bottom tabs since you have a custom search bar
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="folder" options={{ href: null }} />
      </Tabs>

      {/* Renders at the bottom of the screen, but ONLY inside the tabs group */}
      <PersistentSearchBar />
    </View>
  );
}
