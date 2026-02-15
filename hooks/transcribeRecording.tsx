import * as SpeechTranscriber from "expo-speech-transcriber";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export function useTranscribeRecording() {
  const [transcription, setTranscription] = useState<string>("");
  const [isRealtimeRecording, setIsRealtimeRecording] = useState(false);
  const {
    text: realtimeText,
    isFinal,
    error: realtimeError,
  } = SpeechTranscriber.useRealTimeTranscription();

  useEffect(() => {
    if (isFinal && realtimeText) {
      setTranscription(realtimeText);
    }
  }, [isFinal, realtimeText]);

  const transcribeAudio = async (uri: string) => {
    try {
      if (Platform.OS !== "ios") {
        console.error(
          "File transcription is iOS-only. Use real-time transcription on Android.",
        );
        return;
      }
      if (
        typeof SpeechTranscriber.transcribeAudioWithSFRecognizer !== "function"
      ) {
        console.error("Speech transcriber native module is not available.");
        return;
      }
      const result =
        await SpeechTranscriber.transcribeAudioWithSFRecognizer(uri);
      setTranscription(result);
      console.log("Transcription result:", result);
    } catch (err) {
      console.error("Transcription failed", err);
    }
  };

  const startRealtimeTranscription = async () => {
    try {
      if (typeof SpeechTranscriber.recordRealTimeAndTranscribe !== "function") {
        console.error("Speech transcriber native module is not available.");
        return;
      }
      const micPermission =
        await SpeechTranscriber.requestMicrophonePermissions();
      if (micPermission !== "granted") {
        console.error("Microphone permissions not granted.");
        return;
      }

      if (Platform.OS === "ios") {
        const speechPermission = await SpeechTranscriber.requestPermissions();
        if (speechPermission !== "authorized") {
          console.error("Speech permissions not granted.");
          return;
        }
      }

      setIsRealtimeRecording(true);
      await SpeechTranscriber.recordRealTimeAndTranscribe();
    } catch (err) {
      console.error("Real-time transcription failed", err);
      setIsRealtimeRecording(false);
    }
  };

  const stopRealtimeTranscription = () => {
    if (typeof SpeechTranscriber.stopListening === "function") {
      SpeechTranscriber.stopListening();
    }
    setIsRealtimeRecording(false);
  };

  return {
    transcription,
    transcribeAudio,
    realtimeText,
    isFinal,
    realtimeError,
    isRealtimeRecording,
    startRealtimeTranscription,
    stopRealtimeTranscription,
  };
}
