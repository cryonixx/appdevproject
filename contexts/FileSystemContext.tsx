import * as FileSystem from 'expo-file-system/legacy'; // Use standard import if possible, or 'expo-file-system/legacy' if on SDK 52+ specific setup
import React, { createContext, useContext, useEffect, useState } from 'react';

// --- 🔴 SETUP & PATHS ---
// We use a safe check for the document directory.
const rootDir = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
const METADATA_FILE = rootDir + 'metadata.json';
const RECORDINGS_DIR = rootDir + 'recordings/';

// --- Types ---
export interface FileSystemItem {
  id: string;
  title: string;
  type: 'file' | 'folder';
  uri: string;
  parentId: string | null;
  date: string;
  duration: string;
  isPinned: boolean;
  color?: string; // Used for folders
  notes?: string;
  transcription?: string;
}

interface FileSystemContextType {
  items: FileSystemItem[];
  // updated signature to include color
  createFolder: (name: string, parentId: string | null, color?: string) => Promise<string>;
  // updated signature to include sourceUri
  createFile: (name: string, parentId: string | null, duration?: string, sourceUri?: string) => Promise<string>;
  moveItems: (itemIds: Set<string>, targetFolderId: string | null) => void;
  deleteItems: (itemIds: Set<string>) => void;
  togglePin: (itemId: string) => void;
  renameItem: (itemId: string, newName: string, newColor?: string) => void;
  updateFileData: (itemId: string, transcription: string, notes: string) => void;
}

const FileSystemContext = createContext<FileSystemContextType>({} as any);

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- 1. INITIALIZE ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const dirInfo = await FileSystem.getInfoAsync(RECORDINGS_DIR);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(RECORDINGS_DIR, { intermediates: true });
        }

        const fileInfo = await FileSystem.getInfoAsync(METADATA_FILE);
        if (fileInfo.exists) {
          const content = await FileSystem.readAsStringAsync(METADATA_FILE);
          setItems(JSON.parse(content));
        }
      } catch (error) {
        console.error("Error loading filesystem:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // --- 2. PERSIST ---
  useEffect(() => {
    if (isLoaded) {
      const saveData = async () => {
        try {
          await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(items));
        } catch (error) {
          console.error("Error saving metadata:", error);
        }
      };
      saveData();
    }
  }, [items, isLoaded]);

  // --- 3. ACTIONS ---

  const createFolder = async (name: string, parentId: string | null, color?: string): Promise<string> => {
    const newId = Date.now().toString();
    const physicalPath = RECORDINGS_DIR + newId;

    try {
      await FileSystem.makeDirectoryAsync(physicalPath, { intermediates: true });

      const newFolder: FileSystemItem = {
        id: newId,
        title: name,
        type: 'folder',
        uri: physicalPath,
        parentId: parentId,
        color: color || '#888',
        date: new Date().toLocaleDateString(),
        duration: '',
        isPinned: false,
      };

      setItems(prev => [...prev, newFolder]);
      return newId;
    } catch (error) {
      console.error("Error creating folder on disk:", error);
      return "";
    }
  };

  const createFile = async (
    name: string,
    parentId: string | null,
    duration: string = '',
    sourceUri?: string
  ): Promise<string> => {
    const newId = Date.now().toString();
    
    // Determine extension
    let extension = 'm4a';
    if (sourceUri) {
      const parts = sourceUri.split('.');
      if (parts.length > 1) extension = parts.pop()!;
    }

    const fileName = `${newId}.${extension}`;
    const destinationUri = RECORDINGS_DIR + fileName;

    try {
      if (sourceUri) {
        await FileSystem.copyAsync({
          from: sourceUri,
          to: destinationUri
        });
      }

      const newFile: FileSystemItem = {
        id: newId,
        title: name,
        type: 'file',
        uri: destinationUri,
        parentId: parentId,
        date: new Date().toLocaleDateString(),
        duration: duration,
        isPinned: false,
      };

      setItems(prev => [...prev, newFile]);
      return newId;
    } catch (error) {
      console.error("Error creating file:", error);
      return "";
    }
  };

  const moveItems = (itemIds: Set<string>, targetFolderId: string | null) => {
    setItems(prev => {
      return prev.map(item => {
        if (itemIds.has(item.id) && item.id !== targetFolderId) {
          return { ...item, parentId: targetFolderId };
        }
        return item;
      });
    });
  };

  const deleteItems = async (ids: Set<string>) => {
    const idsToDelete = new Set(ids);

    // Delete from disk first
    for (const id of idsToDelete) {
      const item = items.find(i => i.id === id);
      if (item) {
        // Correct path logic: if it's a folder, it uses ID. If it's a file, we need the URI or ID+ext
        // Ideally use item.uri if it matches the recording logic
        const path = item.uri || (RECORDINGS_DIR + item.id);
        try {
          await FileSystem.deleteAsync(path, { idempotent: true });
        } catch (e) {
          console.log("Error deleting item from disk", e);
        }
      }
    }

    setItems(prev => prev.filter(i => !idsToDelete.has(i.id)));
  };

  const togglePin = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isPinned: !i.isPinned } : i));
  };

  const renameItem = (id: string, newTitle: string, newColor?: string) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, title: newTitle, color: newColor || item.color }
        : item
    ));
  };

  const updateFileData = (itemId: string, transcription: string, notes: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, transcription, notes }
        : item
    ));
  };

  // --- 🔴 THE FIX FOR THE "TEXT STRINGS" ERROR ---
  // Ensure the return is clean. No stray semicolons or comments inside the JSX.
  return (
    <FileSystemContext.Provider
      value={{
        items,
        createFolder,
        createFile,
        moveItems,
        deleteItems,
        togglePin,
        renameItem,
        updateFileData
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
}

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) throw new Error("useFileSystem must be used within a FileSystemProvider");
  return context;
};
