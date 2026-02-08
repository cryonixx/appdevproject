import { Colors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';

export interface FolderData {
  id: string;
  name: string;
  color?: string;
}

interface FolderProps {
  data: FolderData;
  onPress: (id: string) => void;
  // 👇 1. ADD THIS PROP
  onLongPress: (folder: FolderData) => void; 
}

export default function Folder({ data, onPress, onLongPress }: FolderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme] || Colors.light;

  const iconColor = data.color || '#007AFF';

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: 'transparent'} 
      ]}
      onPress={() => onPress(data.id)}
      // 👇 2. CONNECT IT HERE
      onLongPress={() => onLongPress(data)}
      delayLongPress={200} // Short delay for better feel
      activeOpacity={0.7}
    >
      <Ionicons 
        name="folder" 
        size={95} 
        color={iconColor} 
      />

      <Text style={[styles.folderName, { color: themeColors.text }]} numberOfLines={1}>
        {data.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    width: 100,
    padding: 5,
    borderRadius: 12,
  },
  folderName: {
    marginTop: -10,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});