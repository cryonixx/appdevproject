// 📍 FILE: app/folder/_layout.tsx (or app/(tabs)/folder/_layout.tsx)
import { Stack } from "expo-router";

export default function FolderLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 👈 THIS IS THE KILL SWITCH
      }}
    >
      <Stack.Screen name="[id]" getId={({ params }) => String(params?.id)} />
    </Stack>
  );
}
