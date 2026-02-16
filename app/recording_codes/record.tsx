import { Ionicons } from "@expo/vector-icons";
import { AudioModule } from "expo-audio";
import { Stack, useRouter } from "expo-router"; // ✅ Added useRouter
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

// --- IMPORTS ---
import AudioNotesHeader from "@/components/AudioNotesHeader";
import { Colors } from "@/constants/theme";
// import { useTranscribeRecording } from "@/hooks/transcribeRecording";
import { useAudioRecorderHook } from "@/hooks/useAudioRecorderHook";
import { useWhisperModels } from "@/hooks/useWhisperModels";
import { useEffect } from "react";

export default function RecordScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const router = useRouter();

  // --- AUDIO RECORDER HOOK ---
  const {
    audioUri,
    startRecording,
    stopRecording,
    discardRecording,
    isRecording,
  } = useAudioRecorderHook();

  const {
    //State
    modelFiles,
    isDownloading,
    downloadProgress,
    isInitialized,
    whisperContext,
    vadContext,
    currentModelId,

    // Helpers
    getModelById,
    getCurrentModel,
    isModelDownloaded,
    getDownloadProgress,

    //Actions
    downloadModel,
    initializeWhisperModel,

    availableModels: WHISPER_MODELS,
  } = useWhisperModels();

  const initializeModel = async (modelId: string = "base") => {
    try {
      await initializeWhisperModel(modelId);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // Initialize the default model when the component mounts
    initializeModel();
  }, []);

  // --- HANDLER FUNCTIONS ---

  // TODO: Create a new folder where recordings are saved and manage file URIs properly

  const handleRestart = async () => {
    console.log("🔄 Restarting...");
    try {
      if (!isRecording) {
        console.log("⏹️ Stopping current recording before restart...");
        await stopRecording();
        await discardRecording();
      }
    } catch (err) {
      console.error("Failed to stop recorder", err);
    }
  };

  const handleToggleRecord = async () => {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      console.log("🚫 Microphone permission denied!");
      return;
    }
    try {
      if (!isRecording) {
        await startRecording();
        console.log("🔴 Started recording!");
      } else {
        console.log("⏹️ Stopped recording!");
        await stopRecording();
      }
    } catch (err) {
      console.error("Recorder toggle failed", err);
    }
  };

  const handleCancel = async () => {
    console.log("❌ Canceling and closing modal...");
    await discardRecording();
    router.back();
  };

  const handleTranscribe = async () => {
    console.log("📝 Transcribing...");
    // if (Platform.OS === "android") {
    //   if (isRealtimeRecording) {
    //     stopRealtimeTranscription();
    //     return;
    //   }
    //   await startRealtimeTranscription();
    //   return;
    // }
    // if (!audioUri) {
    //   console.error("No audio URI available to transcribe");
    //   return;
    // }
    // await transcribeAudio(audioUri);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <AudioNotesHeader hideSettings={true} />

      <View style={styles.contentWrapper}>
        {/* --- TOP HALF (Waveform/Transcription Area) --- */}
        <View style={styles.topHalf}>
          {/* Previous placeholder kept for reference */}
          {/*
          <Text style={[styles.placeholderText, { color: themeColors.text }]}>
            {isRecording
              ? "Recording in progress..."
              : "Waveform and Timer go here"}
          </Text>
          */}
          <View
            style={[
              styles.transcriptionBox,
              { backgroundColor: themeColors.container },
            ]}
          >
            <Text
              style={[styles.transcriptionTitle, { color: themeColors.text }]}
            >
              Transcription
            </Text>
            <Text
              style={[styles.transcriptionText, { color: themeColors.text }]}
            >
              {isRecording
                ? "Listening..."
                : "Your transcription will appear here."}
            </Text>
          </View>
        </View>

        {/* --- DIVIDER LINE --- */}
        <View
          style={[
            styles.divider,
            { backgroundColor: themeColors.bordercolorSelected || "#EAEAEA" },
          ]}
        />

        {/* --- BOTTOM HALF (Controls) --- */}
        <View style={styles.bottomHalf}>
          {/* Main Controls Row */}
          <View style={styles.controlsRow}>
            {/* RESTART BUTTON */}
            <TouchableOpacity
              style={[
                styles.pillButton,
                { backgroundColor: themeColors.container },
              ]}
              onPress={handleRestart}
            >
              <Text style={[styles.pillText, { color: themeColors.text }]}>
                Restart
              </Text>
            </TouchableOpacity>

            {/* BIG PLAY/STOP BUTTON */}
            <TouchableOpacity
              style={[
                styles.playButtonOuter,
                { backgroundColor: themeColors.container },
              ]}
              onPress={handleToggleRecord}
            >
              <View
                style={[
                  styles.playButtonInner,
                  { borderColor: themeColors.text },
                ]}
              >
                {/* Dynamically swap icon based on state */}
                {isRecording ? (
                  <Ionicons name="square" size={24} color={themeColors.text} />
                ) : (
                  <Ionicons
                    name="play"
                    size={28}
                    color={themeColors.text}
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* CANCEL BUTTON */}
            <TouchableOpacity
              style={[
                styles.pillButton,
                { backgroundColor: themeColors.container },
              ]}
              onPress={handleCancel}
            >
              <Text style={[styles.pillText, { color: themeColors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          {/* TRANSCRIBE BUTTON */}
          <TouchableOpacity
            style={[
              styles.pillButton,
              { backgroundColor: themeColors.container, marginTop: 25 },
            ]}
            onPress={handleTranscribe}
          >
            <Text style={[styles.pillText, { color: themeColors.text }]}>
              Transcribe
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  topHalf: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  transcriptionBox: {
    width: "90%",
    minHeight: 140,
    borderRadius: 16,
    padding: 16,
    justifyContent: "flex-start",
  },
  transcriptionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  transcriptionText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  placeholderText: {
    fontSize: 18,
    opacity: 0.3,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    width: "100%",
    opacity: 0.5,
  },
  bottomHalf: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    paddingHorizontal: 20,
  },
  pillButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  pillText: {
    fontSize: 16,
    fontWeight: "600",
  },
  playButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});
