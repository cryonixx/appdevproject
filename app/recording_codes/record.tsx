import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router'; // ✅ Added useRouter
import React, { useState } from 'react'; // ✅ Added useState
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

// --- IMPORTS ---
import AudioNotesHeader from '@/components/AudioNotesHeader';
import { Colors } from '@/constants/theme';

export default function RecordScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const router = useRouter();

  // --- MOCK STATE ---
  const [isRecording, setIsRecording] = useState(false);

  // --- HANDLER FUNCTIONS ---
  
  const handleRestart = () => {
    console.log("🔄 Restarting...");
    // Future: Stop current recording, discard temp file, and reset timer to 00:00
    setIsRecording(false); 
  };

  const handleToggleRecord = () => {
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      console.log("🔴 Started recording!");
      // Future: await audioRecorder.startAsync()
    } else {
      console.log("⏹️ Stopped recording!");
      // Future: await audioRecorder.stopAndUnloadAsync()
    }
  };

  const handleCancel = () => {
    console.log("❌ Canceling and closing modal...");
    // Future: Clean up any unsaved temporary audio files in the cache before leaving
    router.back(); 
  };

  const handleTranscribe = () => {
    console.log("📝 Sending audio to NLP pipeline for transcription...");
    // Future: Pass the saved file URI to your speech-to-text API or backend service
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <AudioNotesHeader hideSettings={true} />

      <View style={styles.contentWrapper}>
        
        {/* --- TOP HALF (Placeholder for Waveform) --- */}
        <View style={styles.topHalf}>
          <Text style={[styles.placeholderText, { color: themeColors.text }]}>
            {isRecording ? "Recording in progress..." : "Waveform and Timer go here"}
          </Text>
        </View>

        {/* --- DIVIDER LINE --- */}
        <View style={[styles.divider, { backgroundColor: themeColors.bordercolorSelected || '#EAEAEA' }]} />

        {/* --- BOTTOM HALF (Controls) --- */}
        <View style={styles.bottomHalf}>
          
          {/* Main Controls Row */}
          <View style={styles.controlsRow}>
            
            {/* RESTART BUTTON */}
            <TouchableOpacity 
              style={[styles.pillButton, { backgroundColor: themeColors.container }]}
              onPress={handleRestart}
            >
              <Text style={[styles.pillText, { color: themeColors.text }]}>Restart</Text>
            </TouchableOpacity>

            {/* BIG PLAY/STOP BUTTON */}
            <TouchableOpacity 
              style={[styles.playButtonOuter, { backgroundColor: themeColors.container }]}
              onPress={handleToggleRecord}
            >
              <View style={[styles.playButtonInner, { borderColor: themeColors.text }]}>
                {/* Dynamically swap icon based on state */}
                {isRecording ? (
                  <Ionicons name="square" size={24} color={themeColors.text} />
                ) : (
                  <Ionicons name="play" size={28} color={themeColors.text} style={{ marginLeft: 4 }} />
                )}
              </View>
            </TouchableOpacity>

            {/* CANCEL BUTTON */}
            <TouchableOpacity 
              style={[styles.pillButton, { backgroundColor: themeColors.container }]}
              onPress={handleCancel}
            >
              <Text style={[styles.pillText, { color: themeColors.text }]}>Cancel</Text>
            </TouchableOpacity>
            
          </View>

          {/* TRANSCRIBE BUTTON */}
          <TouchableOpacity 
            style={[styles.pillButton, { backgroundColor: themeColors.container, marginTop: 25 }]}
            onPress={handleTranscribe}
          >
            <Text style={[styles.pillText, { color: themeColors.text }]}>Transcribe</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

// ... [Keep your exact same styles object down here] ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1, 
  },
  topHalf: {
    flex: 1.2, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    opacity: 0.3,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    opacity: 0.5, 
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, 
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
  },
  pillButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25, 
  },
  pillText: {
    fontSize: 16,
    fontWeight: '600',
  },
  playButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3, 
    justifyContent: 'center',
    alignItems: 'center',
  },
});