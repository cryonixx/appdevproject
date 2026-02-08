import { EventBus } from '@/constants/eventsBus'; // 👈 Import the helper
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialTopTabBar, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native'; // Added Text here


export default function AudioNotesHeader(props: MaterialTopTabBarProps) {
  const theme = useColorScheme() ?? 'light';

  const handleSettingsPress = () => {
    EventBus.emitOpenSettings();

  };

  return (
    <View style={{ position: 'relative', backgroundColor: Colors[theme].background }}>
      {/* 1. The Standard Tab Bar */}
      <MaterialTopTabBar {...props} />
      
      
      
      {/* 3. The Circular Settings Button */}
      <TouchableOpacity
        onPress={handleSettingsPress}
        activeOpacity={0.7}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 21,    // Adjusted to fit better on the bar
          zIndex: 100,    // Higher zIndex to ensure it's clickable
          elevation: 10,
          
          // To make it a circle:
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          
          
        }}
      >
        <Image 
        key={theme}
        
          source={require('@/assets/images/settings_icon.png')} 
          style={{
            width: 40,
            height: 40,
            resizeMode: 'contain',
            tintColor: Colors[theme].tint, 
          }}
        />
      </TouchableOpacity>
    </View>
  );
}