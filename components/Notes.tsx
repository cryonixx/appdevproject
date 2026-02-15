import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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

interface NotesProps {
  visible: boolean;
  audioFileId: string | null;
  onClose: () => void;
}

export default function Notes({ visible, audioFileId, onClose }: NotesProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const { items, updateFileData } = useFileSystem();
  const audioFile = items.find((item) => item.id === audioFileId && item.type === 'file');

  // --- STATE ---
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [notes, setNotes] = useState('');
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load existing data when modal opens
  useEffect(() => {
    if (audioFile) {
      setTranscription(audioFile.transcription || '');
      setNotes(audioFile.notes || '');
      
      // Auto-transcribe if needed
      if (!audioFile.transcription) {
        simulateTranscription();
      }
    }
  }, [audioFile, visible]);

  const simulateTranscription = () => {
    setIsTranscribing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockTranscription = "Lately, I've been thinking 'bout my precarious future. Will you be there with me by my side, my girl, my ghoster? Who's to say who calculates? Not me, I'm no computer. Is it a crime to be unsure? In time, we'll find if it's sustainable.";
      setTranscription(mockTranscription);
      setIsTranscribing(false);
      
      // Save transcription immediately
      if (audioFileId) {
        updateFileData(audioFileId, mockTranscription, notes);
      }
    }, 2000);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? 'Pausing audio...' : 'Playing audio...');
  };

  const handleSave = () => {
    if (audioFileId) {
      updateFileData(audioFileId, transcription, notes);
      console.log('Saved notes and transcription for file:', audioFileId);
    }
    onClose();
  };

  if (!audioFile) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        {/* --- HEADER --- */}
        <View style={[styles.header, { backgroundColor: themeColors.container, borderBottomColor: themeColors.bordercolorSelected }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Audio Notes</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* --- TITLE SECTION --- */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: themeColors.text }]}>
              {audioFile.title}
            </Text>
            <Text style={[styles.duration, { color: themeColors.text + '80' }]}>
              {audioFile.duration}
            </Text>
          </View>

          {/* --- TRANSCRIPTION SECTION --- */}
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

          {/* --- NOTES SECTION --- */}
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

          {/* Add spacing at bottom for the controls */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* --- BOTTOM CONTROLS --- */}
        <View
          style={[
            styles.bottomControls,
            {
              backgroundColor: themeColors.container,
              borderTopColor: themeColors.bordercolorSelected,
            },
          ]}
        >
          {/* Play/Pause Button */}
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

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: themeColors.tint }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  duration: {
    fontSize: 16,
    fontWeight: '500',
  },
  transcriptionSection: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  transcriptionBox: {
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  notesSection: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  notesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 150,
    borderWidth: 1,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});