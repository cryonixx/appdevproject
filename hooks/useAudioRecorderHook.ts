import { AudioModule, RecordingPresets, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { useState } from 'react';
import { Alert } from 'react-native';

export interface RecordingFile {
  id: string;
  title: string;
  date: string;
  duration: string;
  uri: string;
}

export function useAudioRecorderHook() {
  const [recordingsList, setRecordingsList] = useState<RecordingFile[]>([]);
  
  // 1. Initialize the recorder
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  
  // 2. Use status to force re-renders so your UI sees isRecording and currentTime changes
  const status = useAudioRecorderState(recorder);

  // --- START RECORDING ---
  const startRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'You need to allow microphone access.');
        return;
      }

      await recorder.prepareToRecordAsync();
      recorder.record();
      
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // --- STOP RECORDING ---
  const stopRecording = async () => {
    try {
      // Capture the final duration before stopping
      const finalDuration = recorder.currentTime;
      
      await recorder.stop();
      
      const uri = recorder.uri;
      console.log('Recording stopped at', uri);

      if (uri) {
        const newFile: RecordingFile = {
          id: Date.now().toString(),
          title: `New Recording ${recordingsList.length + 1}`,
          date: new Date().toLocaleString(),
          duration: formatDuration(finalDuration),
          uri: uri,
        };

        setRecordingsList((prev) => [newFile, ...prev]);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  // Helper: Format seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return {
    startRecording,
    stopRecording,
    isRecording: recorder.isRecording, // Fixed: changed from .recording to .isRecording
    currentTime: recorder.currentTime, // Useful for showing a live timer in your UI
    recordingsList,
    hasPermission: AudioModule.recordingGranted,
  };
}