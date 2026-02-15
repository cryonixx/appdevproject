import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface ProcessingViewProps {
  onRestart: () => void;
  onCancel: () => void;
}

export default function ProcessingView({ onRestart, onCancel }: ProcessingViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  // Animation value for the rotating icon
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      
      {/* TOP SECTION: Label outside the box */}
      <View style={styles.headerSection}>
        <Text style={[styles.statusLabel, { color: themeColors.text }]}>Transcribing...</Text>
      </View>

      {/* CENTER SECTION: The White Box with Spinning Icon */}
      <View style={[styles.visualizationBox, { backgroundColor: themeColors.container }]}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="refresh-outline" size={80} color={themeColors.text} />
        </Animated.View>
        
        {/* Mock Transcription Preview (Faded text as seen in your design) */}
        <View style={styles.textPreviewContainer}>
            <Text style={[styles.previewText, { color: themeColors.text }]}>
                Lately, I've been thinking 'bout my precarious future...
            </Text>
        </View>
      </View>

      {/* TIMER: Static placeholder for consistency */}
      <Text style={[styles.timerText, { color: themeColors.text }]}>20:00</Text>

      {/* BOTTOM SECTION: Controls (Restart & Cancel are still visible in design) */}
      <View style={styles.controlsContainer}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={onRestart}>
            <Text style={[styles.pillText, { color: themeColors.text }]}>Restart</Text>
          </TouchableOpacity>

          {/* Hidden Play Button Placeholder to maintain layout spacing */}
          <View style={[styles.playButtonPlaceholder, { borderColor: themeColors.text, opacity: 0.1 }]}>
             <Ionicons name="play" size={28} color={themeColors.text} />
          </View>

          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.pillText, { color: themeColors.text }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Save button is usually disabled or hidden during processing */}
        <View style={styles.disabledButton}>
          <Text style={[styles.transcribeText, { color: themeColors.text, opacity: 0.3 }]}>Save</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  headerSection: { alignSelf: 'flex-start', marginTop: 20, marginBottom: 15 },
  statusLabel: { fontSize: 20, fontWeight: '600' },
  visualizationBox: {
    width: '100%',
    height: 250,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textPreviewContainer: {
    marginTop: 20,
    opacity: 0.2, // Faded effect from your design
  },
  previewText: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
  timerText: { fontSize: 18, fontWeight: '500', marginTop: 15, opacity: 0.7 },
  controlsContainer: { flex: 1, width: '100%', justifyContent: 'center' },
  buttonsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  playButtonPlaceholder: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  pillText: { fontSize: 16, fontWeight: '600' },
  disabledButton: { alignSelf: 'center', paddingVertical: 10 },
  transcribeText: { fontSize: 16, fontWeight: '500' }
});