// 📍 FILE: app/_layout.tsx
import { FileSystemProvider } from "@/contexts/FileSystemContext";
import { SearchProvider } from '@/contexts/SearchContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import 'react-native-reanimated';
LogBox.ignoreLogs(['Deprecated: prop "getId"']);

import AudioNotesHeader from '@/components/AudioNotesHeader'; // ✅ Import it here!
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <FileSystemProvider>
        <SearchProvider>
        <Stack screenOptions={{ headerShown: false }}>
          
          <Stack.Screen name="(tabs)" />
          
          {/* ✅ Give the Recording Modal its own Header! */}
          <Stack.Screen 
            name="recording_codes/record" 
            options={{ 
              presentation: 'modal', 
              animation: 'slide_from_bottom',
              headerShown: true, // Turn the header back on for this specific screen
              header: () => <AudioNotesHeader /> // Inject your custom header
            }} 
          />

          <Stack.Screen name="+not-found" />
        </Stack>
        </SearchProvider>
      </FileSystemProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
