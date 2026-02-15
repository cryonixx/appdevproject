import * as SpeechTranscriber from "expo-speech-transcriber";
import { useState } from "react";

export function useTranscribeRecording() {
  const [transcription, setTranscription] = useState<string>("");

  const transcribeAudio = async (uri: string) => {
    try {
      const result =
        await SpeechTranscriber.transcribeAudioWithSFRecognizer(uri);
      setTranscription(result);
      console.log("Transcription result:", result);
    } catch (err) {
      console.error("Transcription failed", err);
    }
  };

  return { transcription, transcribeAudio };
}
