<<<<<<< HEAD
import * as FileSystem from 'expo-file-system/legacy';
import React, { createContext, useContext, useEffect, useState } from 'react';
=======
import React, { createContext, useContext, useState } from "react";
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)

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
  type: "file" | "folder";
  parentId: string | null;
  date: string;
  duration: string;
  isPinned: boolean;
  color?: string;
}

interface FileSystemContextType {
  items: FileSystemItem[];
<<<<<<< HEAD
  createFolder: (name: string, parentId: string | null, color?: string) => Promise<string>;
  createFile: (name: string, parentId: string | null, duration?: string) => Promise<string>;
  moveItems: (itemIds: Set<string>, targetFolderId: string | null) => void;
  deleteItems: (itemIds: Set<string>) => void;
  togglePin: (itemId: string) => void;
=======
  // ✅ FIX 1: Changed void to string
  createFolder: (name: string, parentId: string | null) => string;
  moveItems: (itemIds: Set<string>, targetFolderId: string | null) => void;
  deleteItems: (itemIds: Set<string>) => void;
  togglePin: (itemId: string) => void;
  // ✅ FIX 2: Added optional newColor parameter
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)
  renameItem: (itemId: string, newName: string, newColor?: string) => void;
}

const FileSystemContext = createContext<FileSystemContextType>({} as any);

<<<<<<< HEAD
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
=======
export function FileSystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<FileSystemItem[]>([
    {
      id: "1",
      title: "AppDev",
      type: "folder",
      parentId: null,
      color: "#666666",
      date: "",
      duration: "",
      isPinned: false,
    },
    {
      id: "101",
      title: "New Record",
      type: "file",
      parentId: null,
      date: "01/31/26",
      duration: "20:00",
      isPinned: false,
    },
  ]);

  // 1. Create Folder
  const createFolder = (name: string, parentId: string | null): string => {
    // ✅ FIX 3: Ensure we generate the ID once and use it for both the item and the return
    const newId = Date.now().toString();
    const newFolder: FileSystemItem = {
      id: newId, // Use the same generated ID
      title: name,
      type: "folder",
      parentId: parentId,
      color: "#888",
      date: new Date().toLocaleDateString(),
      duration: "",
      isPinned: false,
    };
    setItems((prev) => [...prev, newFolder]);
    return newId;
  };

  // 2. Move Items
  const moveItems = (itemIds: Set<string>, targetFolderId: string | null) => {
    setItems((prev) =>
      prev.map((item) => {
        if (itemIds.has(item.id)) {
          if (item.id === targetFolderId) return item;
          return { ...item, parentId: targetFolderId };
        }
        return item;
      }),
    );
  };

  const deleteItems = (ids: Set<string>) => {
    setItems((prev) => prev.filter((i) => !ids.has(i.id)));
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)
  };

  const togglePin = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isPinned: !i.isPinned } : i)),
    );
  };

  const renameItem = (id: string, newTitle: string, newColor?: string) => {
<<<<<<< HEAD
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, title: newTitle, color: newColor || item.color }
        : item
    ));
  };

  return (
    <FileSystemContext.Provider 
      value={{ items, createFolder, createFile, moveItems, deleteItems, togglePin, renameItem }}
=======
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, title: newTitle, color: newColor || item.color }
          : item,
      ),
    );
  };

  return (
    <FileSystemContext.Provider
      value={{
        items,
        createFolder,
        moveItems,
        deleteItems,
        togglePin,
        renameItem,
      }}
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)
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
