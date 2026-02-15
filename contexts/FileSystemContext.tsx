import * as FileSystem from 'expo-file-system/legacy';
import React, { createContext, useContext, useEffect, useState } from 'react';

// --- 🔴 THE FIX STARTS HERE ---
// We force TypeScript to treat FileSystem as 'any', ignoring the missing type definition.
const FS = FileSystem as any;

// Now we extract documentDirectory safely.
// We also add a fallback string ('') in case it's null, which prevents other crashes.
const rootDir = FS.documentDirectory || FS.cacheDirectory || '';

const METADATA_FILE = rootDir + 'metadata.json';
const RECORDINGS_DIR = rootDir + 'recordings/';
// --- 🟢 THE FIX ENDS HERE ---


// --- Types ---
export interface FileSystemItem {
  id: string;
  title: string;
  type: 'file' | 'folder';
  parentId: string | null;
  date: string;
  duration: string;
  isPinned: boolean;
  color?: string;
}

interface FileSystemContextType {
  items: FileSystemItem[];
  createFolder: (name: string, parentId: string | null, color?: string) => Promise<string>;
  createFile: (name: string, parentId: string | null, duration?: string) => Promise<string>;
  moveItems: (itemIds: Set<string>, targetFolderId: string | null) => void;
  deleteItems: (itemIds: Set<string>) => void;
  togglePin: (itemId: string) => void;
  renameItem: (itemId: string, newName: string, newColor?: string) => void;
}

const FileSystemContext = createContext<FileSystemContextType>({} as any);

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- 1. INITIALIZE ---
  useEffect(() => {
    const loadData = async () => {
      try {
        // Use 'FS' (our casted variable) or 'FileSystem' - both work for methods
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

  // 👇 Add "color?: string" to the arguments
const createFolder = async (name: string, parentId: string | null, color?: string): Promise<string> => {
    const newId = Date.now().toString();
    const physicalPath = RECORDINGS_DIR + newId;

    try {
      await FileSystem.makeDirectoryAsync(physicalPath, { intermediates: true });

      const newFolder: FileSystemItem = {
        id: newId,
        title: name,
        type: 'folder',
        parentId: parentId,
        color: color || '#888', // 👈 USE IT HERE (Use the passed color, or default to gray)
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

  const createFile = async (name: string, parentId: string | null, duration: string = ''): Promise<string> => {
    const newId = Date.now().toString();
    const newFile: FileSystemItem = {
      id: newId,
      title: name,
      type: 'file',
      parentId: parentId,
      date: new Date().toLocaleDateString(),
      duration: duration,
      isPinned: false,
    };
    setItems(prev => [...prev, newFile]);
    return newId;
  };

  const moveItems = (itemIds: Set<string>, targetFolderId: string | null) => {
    setItems(prev => {
      // Basic circular dependency check
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
    
    for (const id of idsToDelete) {
      const item = items.find(i => i.id === id);
      if (item && item.type === 'folder') {
        const path = RECORDINGS_DIR + item.id;
        try {
            await FileSystem.deleteAsync(path, { idempotent: true });
        } catch(e) { console.log("Error deleting folder", e)}
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

  return (
    <FileSystemContext.Provider 
      value={{ items, createFolder, createFile, moveItems, deleteItems, togglePin, renameItem }}
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