/**
 * OpenAI's Whisper models converted to ggml format for use with whisper.cpp
 *
 * Download from https://huggingface.co/ggerganov/whisper.cpp/tree/main
 */
import {
  createDownloadResumable,
  Directory,
  File,
  Paths,
} from "expo-file-system";
import {
  DownloadProgressData,
  FileSystemDownloadResult,
} from "expo-file-system/build/legacy/FileSystem.types";
import { useCallback, useState } from "react";
import type { WhisperContext } from "whisper.rn/index.js";
import { initWhisper } from "whisper.rn/index.js";

export interface WhisperModel {
  id: string;
  label: string;
  url: string;
  filename: string;
  capabilities: {
    multilingual: boolean;
    quantizable: boolean;
    tdrz?: boolean;
  };
}

export const WHISPER_MODELS: WhisperModel[] = [
  {
    id: "tiny",
    label: "Tiny",
    url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin",
    filename: "ggml-tiny.bin",
    capabilities: {
      multilingual: true,
      quantizable: false,
    },
  },
  {
    id: "base",
    label: "Base Model",
    url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin",
    filename: "ggml-base.bin",
    capabilities: {
      multilingual: true,
      quantizable: false,
    },
  },
  {
    id: "small",
    label: "Small Model",
    url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin",
    filename: "ggml-small.bin",
    capabilities: {
      multilingual: true,
      quantizable: false,
    },
  },
];

interface ModelFileInfo {
  path: string;
  size: number;
}

export function useWhisperModels() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [modelFiles, setModelFiles] = useState<Record<string, ModelFileInfo>>(
    {},
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<
    Record<string, number>
  >({});
  const [whisperContext, setWhisperContext] = useState<WhisperContext | null>(
    null,
  );
  const [vadContext, setVadContext] = useState<any>(null);
  const [currentModelId, setCurrentModelId] = useState<string | null>(null);

  async function getModelDirectory() {
    let documentDirectory: Directory;
    try {
      documentDirectory = Paths.document;
    } catch (error) {
      console.log("Error accessing document directory:", error);
      throw new Error("Unable to access document directory");
    }
    const modelDirectory = new Directory(documentDirectory, "whisper_models");
    await modelDirectory.create({ idempotent: true, intermediates: true });
    return modelDirectory;
  }

  async function downloadModel(model: WhisperModel) {
    const directory = await getModelDirectory();
    const file = new File(directory, model.filename);

    const updateModelFileInfo = () => {
      try {
        const stats = file.info();
        if (!stats.exists) throw new Error("File not found");
        setModelFiles((prev) => ({
          ...prev,
          [model.id]: {
            path: file.uri,
            size: Number(stats.size) || 0,
          },
        }));
      } catch (statError) {
        console.warn(
          `Failed to stat model file ${model.id} at ${file.uri}:`,
          statError,
        );
        setModelFiles((prev) => ({
          ...prev,
          [model.id]: {
            path: file.uri,
            size: 0,
          },
        }));
      }
    };

    let existingInfo;
    try {
      existingInfo = await file.info();
    } catch (infoError) {
      console.warn("Error checking existing file info:", infoError);
      existingInfo = { exists: false };
    }

    if (existingInfo) {
      console.log(`Model ${model.id} file already exists at ${file.uri}`);
      updateModelFileInfo();

      return file.uri;
    }
    setIsDownloading(true);
    console.log(`Downloading model ${model.id} from ${model.url}`);
    try {
      const downloadResumable = createDownloadResumable(
        model.url,
        file.uri,
        undefined,
        (progressData: DownloadProgressData) => {
          const { totalBytesWritten, totalBytesExpectedToWrite } = progressData;
          const fraction =
            totalBytesExpectedToWrite > 0
              ? totalBytesWritten / totalBytesExpectedToWrite
              : 0;
          setDownloadProgress((prev) => ({
            ...prev,
            [model.id]: fraction,
          }));
          console.log(
            `Download progress for ${model.id}: ${(fraction * 100).toFixed(
              1,
            )}%`,
          );
        },
      );

      const downloadResult = (await downloadResumable.downloadAsync()) as
        | FileSystemDownloadResult
        | undefined;

      if (
        downloadResult &&
        (downloadResult.status === 0 ||
          (downloadResult.status >= 200 && downloadResult.status < 300))
      ) {
        console.log(`Successfully downloaded model ${model.id}`);
        updateModelFileInfo();
        setDownloadProgress((prev) => ({ ...prev, [model.id]: 1 }));
        return file.uri;
      } else {
        throw new Error(
          `Download failed with status: ${downloadResult?.status}`,
        );
      }
    } catch (error) {
      console.error(`Error downloading model ${model.id}:`, error);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  }

  async function initializeWhisperModel(modelId: string) {
    const model = WHISPER_MODELS.find((m) => m.id === modelId);
    if (!model) {
      alert(`Model with id ${modelId} not found`);
      return;
    }
    try {
      setIsInitialized(true);
      // download the model if it doesn't exist and get the file path
      const modelPath = await downloadModel(model);
      // initialize whisper context
      const context = await initWhisper({
        filePath: modelPath,
      });

      setWhisperContext(context);
      setCurrentModelId(modelId);
      console.log(
        `Whisper model ${modelId} initialized with context:`,
        context,
      );

      return {
        whisperContext: context,
        vadContext: null,
      };
    } catch (e) {
      console.log(e);
    } finally {
      setIsInitialized(false);
    }
  }

  const getModelById = useCallback((modelId: string) => {
    return WHISPER_MODELS.find((m) => m.id === modelId);
  }, []);

  const getCurrentModel = useCallback(() => {
    return currentModelId ? getModelById(currentModelId) : null;
  }, [currentModelId, getModelById]);

  const isModelDownloaded = useCallback(
    (modelId: string) => {
      return modelFiles[modelId] !== undefined;
    },
    [modelFiles],
  );

  const getDownloadProgress = useCallback(
    (modelId: string) => {
      return downloadProgress[modelId] || 0;
    },
    [downloadProgress],
  );

  return {
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
  };
}
