// app/record.tsx
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';

import AudioNotesHeader from '@/components/AudioNotesHeader';
import ProcessingView from '@/components/ProcessingView';
import RecordView from '@/components/RecordView';
import ResultView from '@/components/ResultView';
import SaveModal from '@/components/SaveModal'; // ✅ Import Modal
import { Colors } from '@/constants/theme';

export default function RecordScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const router = useRouter();

  const [stage, setStage] = useState<'record' | 'process' | 'done'>('record');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false); // ✅ Modal State

  // --- HANDLERS ---
  const handleTranscribe = () => {
    setStage('process');
    setTimeout(() => {
        setTranscript("Lately, I've been thinking 'bout my precarious future...");
        setStage('done');
    }, 2000);
  };

  const handleFinalSave = (fileName: string) => {
    console.log("💾 ATTEMPTING SAVE:");
    console.log("File Name:", fileName);
    console.log("Content:", transcript);
    
    setIsSaveModalVisible(false);
    // Future: Add logic here to write to file system/database
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <AudioNotesHeader hideSettings={true} />

      <View style={styles.contentWrapper}>
        {stage === 'record' && (
          <RecordView 
            isRecording={isRecording}
            onToggleRecord={() => setIsRecording(!isRecording)}
            onRestart={() => setIsRecording(false)}
            onCancel={() => router.back()}
            onTranscribe={handleTranscribe}
          />
        )}

        {stage === 'process' && (
          <ProcessingView 
            onRestart={() => setStage('record')} 
            onCancel={() => router.back()} 
          />
        )}

        {stage === 'done' && (
          <ResultView 
            transcript={transcript}
            onRestart={() => setStage('record')}
            onCancel={() => router.back()}
            onSave={() => setIsSaveModalVisible(true)} // ✅ Trigger Modal
          />
        )}
      </View>

      {/* ✅ SAVE MODAL OVERLAY */}
      <SaveModal 
        isVisible={isSaveModalVisible}
        onClose={() => setIsSaveModalVisible(false)}
        onSave={handleFinalSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrapper: { flex: 1 },
});