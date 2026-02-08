import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import React from 'react';
import { View } from 'react-native';

// Import custom components
import AudioNotesHeader from '@/components/AudioNotesHeader';
import PersistentSearchBar from '@/components/PersistentSearchBar';

// 1. Create the Navigator Instance
const { Navigator } = createMaterialTopTabNavigator();

// 2. Wrap it with Expo Router context
// This allows <MaterialTopTabs> to act as the Router
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TopTabsLayout() {
  const theme = useColorScheme() ?? 'light';

  return (
    // Wrapper View for the whole screen
    <View style={{ flex: 1, backgroundColor: Colors[theme].background }}>
      
      {/* The Tab Navigator 
         IMPORTANT: We must ensure this takes up all available space (flex: 1)
         so it doesn't get squashed by the search bar.
      */}
      <View style={{ flex: 1 }}>
        <MaterialTopTabs
          tabBar={(props) => <AudioNotesHeader {...props} />}
          screenOptions={{
            tabBarActiveTintColor: Colors[theme].tint,
            tabBarInactiveTintColor: Colors[theme].tabIconDefault,
            swipeEnabled: false,
            tabBarItemStyle: {
              width: 'auto', 
              justifyContent: 'flex-start',
              paddingLeft: 15,
            },
            tabBarIndicatorStyle: {
              backgroundColor: Colors[theme].background,
              height: 1,
            },
            tabBarStyle: {
              backgroundColor: Colors[theme].background,
              elevation: 0,
              shadowOpacity: 0,
              paddingTop: 30,
              borderBottomWidth: 3, 
              borderBottomColor: Colors[theme].bordercolorSelected,
            },
            tabBarLabelStyle: {
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: 40,
            },
          }}
        >
          {/* This name="index" MUST match a file named "index.tsx" 
             in the same folder as this _layout.tsx 
          */}
          <MaterialTopTabs.Screen name="index" options={{ title: 'Audio Notes' }} />
        </MaterialTopTabs>
      </View>

      {/* Persistent Footer */}
      <PersistentSearchBar />
      
    </View>
  );
}
