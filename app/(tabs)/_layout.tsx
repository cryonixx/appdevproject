import React, { createContext, useContext, useState } from 'react';


// Types
export interface FileSystemItem {
  id: string;
  title: string; // or name for folders
  type: 'file' | 'folder';
  parentId: string | null; // null = root
  // ... other props like date, duration, color
  date?: string;
  duration?: string;
  isPinned?: boolean;
  color?: string;
}

interface FileSystemContextType {
  items: FileSystemItem[];
  createFolder: (name: string, parentId: string | null) => void;
  moveItems: (itemIds: Set<string>, targetFolderId: string | null) => void;
  deleteItems: (itemIds: Set<string>) => void;
  togglePin: (itemId: string) => void;
  renameItem: (itemId: string, newName: string) => void;
}

const FileSystemContext = createContext<FileSystemContextType>({} as any);

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  // --- MOCK INITIAL DATA ---
  const [items, setItems] = useState<FileSystemItem[]>([
    { id: '1', title: 'AppDev', type: 'folder', parentId: null, color: '#666666' },
    { id: '2', title: 'SoftEng', type: 'folder', parentId: null, color: '#2196F3' },
    { id: '101', title: 'New Record', type: 'file', parentId: null, date: '01/31/26', duration: '20:00', isPinned: false },
    { id: '104', title: 'AppDev Intro', type: 'file', parentId: '1', date: '02/05/26', duration: '15:00', isPinned: false },
  ]);

  // 1. Create Folder
  const createFolder = (name: string, parentId: string | null) => {
    const newFolder: FileSystemItem = {
      id: Date.now().toString(),
      title: name,
      type: 'folder',
      parentId: parentId, // ✅ This ensures it is created in the current page
      color: '#888',
    };
    setItems(prev => [...prev, newFolder]);
  };

  // 2. Move Items (The Fix)
  const moveItems = (itemIds: Set<string>, targetFolderId: string | null) => {
    setItems(prev => prev.map(item => {
      if (itemIds.has(item.id)) {
        // prevent moving a folder into itself
        if (item.id === targetFolderId) return item; 
        return { ...item, parentId: targetFolderId };
      }
      return item;
    }));
  };

  const deleteItems = (ids: Set<string>) => {
    setItems(prev => prev.filter(i => !ids.has(i.id)));
  };

  const togglePin = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isPinned: !i.isPinned } : i));
  };

  const renameItem = (id: string, newName: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, title: newName } : i));
  };

  return (
    <FileSystemContext.Provider value={{ items, createFolder, moveItems, deleteItems, togglePin, renameItem }}>
      {children}
    </FileSystemContext.Provider>
  );
}

export const useFileSystem = () => useContext(FileSystemContext);