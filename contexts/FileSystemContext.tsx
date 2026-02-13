import React, { createContext, useContext, useState } from 'react';

// Types
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
  // ✅ FIX 1: Changed void to string
  createFolder: (name: string, parentId: string | null) => string; 
  moveItems: (itemIds: Set<string>, targetFolderId: string | null) => void;
  deleteItems: (itemIds: Set<string>) => void;
  togglePin: (itemId: string) => void;
  // ✅ FIX 2: Added optional newColor parameter
  renameItem: (itemId: string, newName: string, newColor?: string) => void; 
}

const FileSystemContext = createContext<FileSystemContextType>({} as any);

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FileSystemItem[]>([
    { 
      id: '1', title: 'AppDev', type: 'folder', parentId: null, color: '#666666',
      date: '', duration: '', isPinned: false 
    },
    { 
      id: '101', title: 'New Record', type: 'file', parentId: null, 
      date: '01/31/26', duration: '20:00', isPinned: false 
    },
  ]);

  // 1. Create Folder
  const createFolder = (name: string, parentId: string | null): string => {
    // ✅ FIX 3: Ensure we generate the ID once and use it for both the item and the return
    const newId = Date.now().toString(); 
    const newFolder: FileSystemItem = {
      id: newId, // Use the same generated ID
      title: name,
      type: 'folder',
      parentId: parentId,
      color: '#888',
      date: new Date().toLocaleDateString(),
      duration: '',
      isPinned: false,
    };
    setItems(prev => [...prev, newFolder]);
    return newId; 
  };
  
  // 2. Move Items
  const moveItems = (itemIds: Set<string>, targetFolderId: string | null) => {
    setItems(prev => prev.map(item => {
      if (itemIds.has(item.id)) {
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

  // 3. Rename Item
  const renameItem = (id: string, newTitle: string, newColor?: string) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, title: newTitle, color: newColor || item.color } 
        : item
    ));
  };

  return (
    <FileSystemContext.Provider value={{ items, createFolder, moveItems, deleteItems, togglePin, renameItem }}>
      {children}
    </FileSystemContext.Provider>
  );
}

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context || Object.keys(context).length === 0) {
    throw new Error("useFileSystem must be used within a FileSystemProvider");
  }
  return context;
};