import { Colors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

interface AudioFileProps {
  title: string;
  date: string;
  duration: string;
  isPinned?: boolean;
  onPress: () => void;
  onLongPress: () => void; // 👈 Add this
}

export default function AudioFile({ title, date, duration, isPinned, onPress, onLongPress }: AudioFileProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme] || Colors.light;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: themeColors.container }]} 
      onPress={onPress}
      onLongPress={onLongPress} // 👈 Connect it here
      delayLongPress={200}      
      activeOpacity={0.7}
    >
      <View style={styles.iconBox}>
        <Ionicons name="document-text-outline" size={24} color={themeColors.text} />
        {isPinned && (
          <View style={[styles.pinBadge, { backgroundColor: themeColors.background }]}>
            <Ionicons name="pin" size={10} color={themeColors.tint} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={1}>{title}</Text>
        <Text style={[styles.date, { color: themeColors.lightext }]}>{date}</Text>
      </View>

      <Text style={[styles.duration, { color: themeColors.text }]}>{duration}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderRadius: 16, marginBottom: 10, marginHorizontal: 20,
  },
  iconBox: { marginRight: 15 },
  pinBadge: {
    position: 'absolute', bottom: -2, right: -4, width: 16, height: 16,
    borderRadius: 8, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)',
  },
  content: { flex: 1, justifyContent: 'center', paddingRight: 10 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  date: { fontSize: 12 },
  duration: { fontSize: 14, fontWeight: '500' },
});