// 📍 FILE: app/(tabs)/_layout.tsx
import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme, View } from 'react-native';

// --- IMPORTS ---
import AudioNotesHeader from '@/components/AudioNotesHeader';
import PersistentSearchBar from '@/components/PersistentSearchBar'; // ✅ Added this
import { FileSystemProvider } from '@/contexts/FileSystemContext';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <FileSystemProvider>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: themeColors.tint,
            // Uses your custom top header
            header: (props) => <AudioNotesHeader {...props} />,
            // ✅ Hides the native "Home/Folder" bar at the bottom
            tabBarStyle: { display: 'none' }, 
          }}
        >
          <Tabs.Screen
            name="index"
            options={{ title: 'Home' }}
          />
          
          <Tabs.Screen
            name="folder"
            options={{
              href: null,
              headerShown: false,
            }}
          />
        </Tabs>

        {/* ✅ THE PERSISTENT SEARCH BAR */}
        {/* Placed outside <Tabs> so it floats over every screen in this layout */}
        <PersistentSearchBar />
      </View>
    </FileSystemProvider>
  );
}
