// 📍 FILE: app/_layout.tsx
import { FileSystemProvider } from "@/contexts/FileSystemContext";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import AudioNotesHeader from '@/components/AudioNotesHeader'; // ✅ Import it here!
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <FileSystemProvider>
        <Stack screenOptions={{ headerShown: false }}>
          
          <Stack.Screen name="(tabs)" />
          
          {/* ✅ Give the Recording Modal its own Header! */}
          <Stack.Screen 
            name="Recording/record" 
            options={{ 
              presentation: 'modal', 
              animation: 'slide_from_bottom',
              headerShown: true, // Turn the header back on for this specific screen
              header: () => <AudioNotesHeader /> // Inject your custom header
            }} 
          />

          <Stack.Screen name="+not-found" />
        </Stack>
      </FileSystemProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}