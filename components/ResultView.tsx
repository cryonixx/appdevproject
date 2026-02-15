import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface ResultViewProps {
  transcript: string;
  onRestart: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function ResultView({ transcript, onRestart, onCancel, onSave }: ResultViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      
      {/* TOP SECTION: Label outside the box */}
      <View style={styles.headerSection}>
        <Text style={[styles.statusLabel, { color: themeColors.text }]}>Transcribed</Text>
      </View>

      {/* CENTER SECTION: The White Box with Scrollable Text */}
      <View style={[styles.visualizationBox, { backgroundColor: themeColors.container }]}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <Text style={[styles.transcriptText, { color: themeColors.text }]}>
            {transcript || "No transcription available."}
          </Text>
        </ScrollView>
        
        {/* The small 'document' icon from your design */}
        <View style={styles.iconOverlay}>
            <Ionicons name="document-text-outline" size={24} color={themeColors.text} opacity={0.5} />
        </View>
      </View>

      {/* TIMER: Remains visible for reference */}
      <Text style={[styles.timerText, { color: themeColors.text }]}>20:00</Text>

      {/* BOTTOM SECTION: Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={onRestart}>
            <Text style={[styles.pillText, { color: themeColors.text }]}>Restart</Text>
          </TouchableOpacity>

          {/* Play button remains but is usually for playback of the recording here */}
          <TouchableOpacity style={[styles.playButton, { borderColor: themeColors.text }]}>
             <Ionicons name="play" size={28} color={themeColors.text} style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.pillText, { color: themeColors.text }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* SAVE ACTION */}
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={[styles.saveButtonText, { color: themeColors.text }]}>Save</Text>
        </TouchableOpacity>
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
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  transcriptText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  timerText: { fontSize: 18, fontWeight: '500', marginTop: 15, opacity: 0.7 },
  controlsContainer: { flex: 1, width: '100%', justifyContent: 'center' },
  buttonsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  playButton: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  pillText: { fontSize: 16, fontWeight: '600' },
  saveButton: { alignSelf: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  saveButtonText: { fontSize: 16, fontWeight: '500' }
});