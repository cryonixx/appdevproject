import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

interface RecordViewProps {
  isRecording: boolean;
  recordingDuration?: string;
  onToggleRecord: () => void;
  onRestart: () => void;
  onCancel: () => void;
  onTranscribe: () => void;
}

export default function RecordView({
  isRecording,
  recordingDuration = "20:00",
  onToggleRecord,
  onRestart,
  onCancel,
  onTranscribe,
}: RecordViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      
      {/* --- TOP HALF: Display & Voice --- */}
      <View style={[styles.topHalf, { backgroundColor: themeColors.container }]}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Record</Text>
        
        <View style={styles.waveformContainer}>
           {[30, 60, 90, 50, 70, 100, 60, 40].map((height, index) => (
             <View 
               key={index} 
               style={[
                 styles.waveBar, 
                 { 
                   height: isRecording ? height : 8, 
                   backgroundColor: themeColors.text 
                 }
               ]} 
             />
           ))}
        </View>

        <Text style={[styles.timerText, { color: themeColors.text }]}>
          {recordingDuration}
        </Text>
      </View>

      {/* --- BOTTOM HALF: Controls --- */}
      <View style={styles.bottomHalf}>
        
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.pillButton} onPress={onRestart}>
            <Text style={[styles.pillText, { color: themeColors.text }]}>Restart</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.recordButtonOuter, { backgroundColor: themeColors.container }]} 
            onPress={onToggleRecord}
          >
            <View style={[styles.recordButtonInner, { borderColor: themeColors.text }]}>
               {isRecording ? (
                 <Ionicons name="square" size={24} color={themeColors.text} />
               ) : (
                 <Ionicons name="play" size={28} color={themeColors.text} style={{ marginLeft: 4 }} />
               )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pillButton} onPress={onCancel}>
            <Text style={[styles.pillText, { color: themeColors.text }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.transcribeButton, { backgroundColor: themeColors.container }]} 
          onPress={onTranscribe}
        >
          <Text style={[styles.pillText, { color: themeColors.text }]}>Transcribe</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHalf: {
    flex: 1, // Equal split
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    position: 'absolute',
    top: 20,
    left: 20,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    gap: 10,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
  },
  bottomHalf: {
    flex: 1, // Equal split
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 40,
  },
  pillButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  pillText: {
    fontSize: 16,
    fontWeight: '600',
  },
  recordButtonOuter: {
    width: 85,
    height: 85,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  recordButtonInner: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transcribeButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 2,
  },
});