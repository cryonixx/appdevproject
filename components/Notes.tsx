import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

import AudioNotesHeader from '@/components/AudioNotesHeader';

interface NotesProps {
  visible: boolean;
  audioFileId: string | null;
  onClose: () => void;
}

const formatTime = (millis: number) => {
  if (!millis) return '0:00';
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function Notes({ visible, audioFileId, onClose }: NotesProps) {
  // ✅ 1. Get Theme Colors
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const { items, updateFileData } = useFileSystem();
  const audioFile = items.find((item) => item.id === audioFileId && item.type === 'file');

  // --- STATE ---
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [notes, setNotes] = useState('');
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  
  // Audio State
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0); 
  const [duration, setDuration] = useState(0); 

  useEffect(() => {
    if (audioFile) {
      setTranscription(audioFile.transcription || '');
      setNotes(audioFile.notes || '');
      
      if (!audioFile.transcription) {
        simulateTranscription();
      }
    }
  }, [audioFile, visible]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const simulateTranscription = () => {
    setIsTranscribing(true);
    setTimeout(() => {
      const mockTranscription = "Lately, I've been thinking 'bout my precarious future...";
      setTranscription(mockTranscription);
      setIsTranscribing(false);
      
      if (audioFileId) {
        updateFileData(audioFileId, mockTranscription, notes);
      }
    }, 2000);
  };

  async function handlePlayPause() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
      });

      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
        return;
      }

      if (audioFile?.uri) {
        const fileInfo = await FileSystem.getInfoAsync(audioFile.uri);
        if (!fileInfo.exists) {
          Alert.alert("Error", "Audio file not found.");
          return;
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioFile.uri },
          { shouldPlay: true }
        );
        
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);

            if (status.didJustFinish) {
              setIsPlaying(false);
              newSound.setPositionAsync(0);
              setPosition(0);
            }
          }
        });
      } else {
        Alert.alert("Error", "No audio file linked to this note.");
      }
    } catch (error) {
      console.error("Error playing sound:", error);
      Alert.alert("Playback Error", "Could not play the audio file.");
    }
  }

  const handleSave = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    if (audioFileId) {
      updateFileData(audioFileId, transcription, notes);
    }
    onClose();
  };

  if (!audioFile) return null;

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        
        <AudioNotesHeader hideSettings={true} />

        <TouchableOpacity 
          onPress={onClose} 
          style={styles.closeButtonOverlay}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={32} color={themeColors.tint} />
        </TouchableOpacity>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Title Section */}
          <View style={[styles.titleSection, { borderBottomColor: themeColors.bordercolorSelected }]}>
            <Text style={[styles.title, { color: themeColors.text }]}>
              {audioFile.title}
            </Text>
            <Text style={[styles.duration, { color: themeColors.text + '80' }]}>
              {audioFile.duration}
            </Text>
          </View>

          {/* Transcription Section */}
          <View style={styles.transcriptionSection}>
            <Text style={[styles.sectionLabel, { color: themeColors.text + '80' }]}>
              Transcription
            </Text>
            {isTranscribing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={themeColors.tint} />
                <Text style={[styles.loadingText, { color: themeColors.text + '80' }]}>
                  Transcribing...
                </Text>
              </View>
            ) : (
              <View style={[styles.transcriptionBox, { backgroundColor: themeColors.container }]}>
                <Text style={[styles.transcriptionText, { color: themeColors.text }]}>
                  {transcription || 'No transcription available'}
                </Text>
              </View>
            )}
          </View>

          {/* Notes Section */}
          <View style={styles.notesSection}>
            <TouchableOpacity
              style={styles.notesSectionHeader}
              onPress={() => setIsNotesExpanded(!isNotesExpanded)}
              activeOpacity={0.7}
            >
              <Text style={[styles.sectionLabel, { color: themeColors.text + '80' }]}>
                Notes
              </Text>
              <Ionicons
                name={isNotesExpanded ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color={themeColors.text + '80'}
              />
            </TouchableOpacity>

            {isNotesExpanded && (
              <TextInput
                style={[
                  styles.notesInput,
                  {
                    backgroundColor: themeColors.container,
                    color: themeColors.text,
                    borderColor: themeColors.bordercolorSelected,
                  },
                ]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add your notes here..."
                placeholderTextColor={themeColors.text + '40'}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            )}
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* --- 👇 UPDATED CONTROLS WITH THEME COLORS --- */}
        <View
          style={[
            styles.bottomControls,
            {
              backgroundColor: themeColors.container, // Uses container color for contrast
              borderTopColor: themeColors.bordercolorSelected, // Uses defined border color
            },
          ]}
        >
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.timeRow}>
              <Text style={[styles.timeText, { color: themeColors.text }]}>
                {formatTime(position)}
              </Text>
              <Text style={[styles.timeText, { color: themeColors.text }]}>
                {formatTime(duration)}
              </Text>
            </View>
            
            <View style={[styles.progressBarTrack, { backgroundColor: themeColors.text + '20' }]}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${progressPercent}%`,
                    backgroundColor: themeColors.tint // Uses main tint color
                  }
                ]} 
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.playButton, { backgroundColor: themeColors.background }]}
              onPress={handlePlayPause}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={24}
                color={themeColors.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: themeColors.tint }]}
              onPress={handleSave}
            >
              {/* Text color is background color to ensure contrast (Light text on Dark Tint, Dark text on Light Tint) */}
              <Text style={[styles.saveButtonText, { color: themeColors.background }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// --- STATIC LAYOUT STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  closeButtonOverlay: { position: 'absolute', top: 55, right: 20, zIndex: 100 },
  scrollContent: { flex: 1, paddingHorizontal: 20 },
  titleSection: { 
    paddingVertical: 20, 
    borderBottomWidth: 1, 
    // borderBottomColor is dynamic now
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  duration: { fontSize: 16, fontWeight: '500' },
  transcriptionSection: { paddingTop: 24, paddingBottom: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  loadingContainer: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 12, fontSize: 14 },
  transcriptionBox: { borderRadius: 12, padding: 16, minHeight: 120 },
  transcriptionText: { fontSize: 16, lineHeight: 24 },
  notesSection: { paddingTop: 16, paddingBottom: 24 },
  notesSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  notesInput: { borderRadius: 12, padding: 16, fontSize: 16, lineHeight: 24, minHeight: 150, borderWidth: 1 },

  // Updated Control Styles (Layout only, colors are dynamic)
  bottomControls: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  progressContainer: {
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    opacity: 0.7,
  },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButton: {
    flex: 1,
    marginLeft: 16,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});