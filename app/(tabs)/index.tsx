import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

// --- IMPORTS ---
import { EventBus } from '@/constants/eventsBus';
import { Colors } from "@/constants/theme";
import { useFocusEffect } from '@react-navigation/native';


// ✅ CUSTOM COMPONENTS
import ActionModal from '@/components/ActionModal';
import AudioFile from '@/components/AudioFileItem';
import Folder, { FolderData } from '@/components/folder';
import { useRouter } from 'expo-router';
// ✅ Ensure this is imported
import MoveFileModal from '@/components/MoveFileModal';

// ✅ IMPORT CONTEXT
import { useFileSystem } from '@/contexts/FileSystemContext';

// --- TYPES ---
interface RecordingFile {
  id: string; title: string; date: string; duration: string; isPinned: boolean; folderId?: string | null;
}
interface ExtendedFolderData extends FolderData {
    folderId?: string | null;
}

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme] || Colors.light;
  const [isCreating, setIsCreating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = EventBus.onOpenSettings(() => {
        setOptionsModalVisible(true);
      });
      return () => {
        unsubscribe();
      };
    }, [])
  );
  const [modalMode, setModalMode] = useState<'menu' | 'rename'>('menu');

  // --- DATA ---
  const { items, createFolder, moveItems, deleteItems, togglePin, renameItem } = useFileSystem();

  // --- UI STATES ---
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [moveModalVisible, setMoveModalVisible] = useState(false);

  // --- SELECTION ---
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // --- TARGETS ---
  const [targetFile, setTargetFile] = useState<RecordingFile | null>(null);
  const [targetFolder, setTargetFolder] = useState<ExtendedFolderData | null>(null);

  // --- FILTERING (Root Level) ---
  const rootFolders: ExtendedFolderData[] = items
    .filter(i => i.type === 'folder' && i.parentId === null)
    .map(i => ({ 
        id: i.id, 
        name: i.title, 
        color: i.color || '#666', 
        folderId: i.parentId 
    }));

  const rootFiles: RecordingFile[] = items
    .filter(i => i.type === 'file' && i.parentId === null)
    .map(i => ({
        id: i.id,
        title: i.title,
        date: i.date,
        duration: i.duration,
        isPinned: i.isPinned,
        folderId: i.parentId
    }));
  
  const pinnedFiles = items
    .filter(i => i.type === 'file' && i.isPinned) 
    .filter(i => i.parentId === null) 
    .map(i => ({ id: i.id, title: i.title, date: i.date, duration: i.duration, isPinned: i.isPinned, folderId: i.parentId }));

  const recentFiles = rootFiles.filter(f => !f.isPinned);

  // --- RENDER HELPER ---
  const renderSelectable = (component: React.ReactNode, id: string) => {
    const isSelected = selectedIds.has(id);
    return (
      <View style={{ position: 'relative', opacity: (isSelectionMode && !isSelected) ? 0.5 : 1 }}>
        {component}
        {isSelectionMode && (
          <View style={[styles.checkbox, isSelected && { backgroundColor: themeColors.tint, borderColor: themeColors.tint }]}>
            {isSelected && <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</Text>}
          </View>
        )}
      </View>
    );
  };

  // --- HANDLERS ---
  const handleItemPress = (id: string, type: 'file' | 'folder') => {
    if (isSelectionMode) {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
    } else {
      if (type === 'folder') {
        router.push(`/folder/${id}`)
      } else {
        console.log(`Playing file ${id}`);
      }
    }
  };  

  const handleLongPress = (item: any, type: 'file' | 'folder') => {
    if (isSelectionMode) return;
    if (type === 'file') {
      setTargetFile(item);
      setTargetFolder(null);
    } else {
      setTargetFolder(item);
      setTargetFile(null);
    }
    setModalMode('menu'); 
    setActionModalVisible(true);
  };

  // --- ACTIONS ---

  const handleOpenMove = () => {
     if (targetFile || targetFolder) {
        setActionModalVisible(false);
        setTimeout(() => setMoveModalVisible(true), 300);
     }
     else if (isSelectionMode && selectedIds.size > 0) {
        setMoveModalVisible(true);
     }
  };

  const executeMove = (targetFolderId: string | null) => {
    let idsToMove = new Set<string>();
    
    if (isSelectionMode) {
        idsToMove = selectedIds;
    } else {
        if (targetFile) idsToMove.add(targetFile.id);
        if (targetFolder) idsToMove.add(targetFolder.id);
    }

    moveItems(idsToMove, targetFolderId);

    setMoveModalVisible(false);
    setIsSelectionMode(false);
    setSelectedIds(new Set());
    setTargetFile(null);
    setTargetFolder(null);
  };

  const handleCreateFolder = () => {
    setOptionsModalVisible(false);
    setTargetFolder(null);
    setTargetFile(null);
    setIsCreating(true); 
    setModalMode('rename'); 
    setTimeout(() => {
      setActionModalVisible(true);
    }, 500);
  };
  
  const handleBatchDelete = () => {
  // ✅ 1. Clone the Set to prevent passing a raw state reference
  const idsToDelete = new Set(selectedIds);

  const executeDelete = () => {
    deleteItems(idsToDelete);
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  // ✅ 2. Handle Expo Web's inability to process Alert.alert button callbacks
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(`Delete ${selectedIds.size} items?`);
    if (confirmed) executeDelete();
    return;
  }

  // Native Alert for iOS/Android
  Alert.alert("Delete Items", `Delete ${selectedIds.size} items?`, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: 'destructive',
      onPress: executeDelete
    }
  ]);
};

  // ✅ FIX 1: Helper to get the correct set of items being moved
  // This solves the TypeScript "undefined" error and Logic error
  const getMovingItems = () => {
    if (isSelectionMode) return selectedIds;
    const id = targetFile?.id || targetFolder?.id;
    return id ? new Set([id]) : new Set<string>();
  };

  // ✅ FIX 2: Prepare folders list (excluding the ones being moved)
  const availableFolders = items
    .filter(i => i.type === 'folder' && !getMovingItems().has(i.id))
    .map(f => ({
        id: f.id,
        name: f.title,
        folderId: f.parentId
    }));

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {/* FOLDERS (Root) */}
        <Text style={[styles.sectionTitle, { color: themeColors.text, marginTop: 20 }]}>Folders</Text>
        <FlatList
          data={rootFolders} 
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 22, paddingRight: 30, paddingTop: 10, gap: 15 }}
          extraData={selectedIds}
          renderItem={({ item }) => renderSelectable(
            <Folder 
              data={item} 
              onPress={() => handleItemPress(item.id, 'folder')}
              onLongPress={() => handleLongPress(item, 'folder')}
            />, item.id
          )}
        />

        {/* PINNED (Root) */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Pinned</Text>
        <View style={styles.listContainer}>
          {pinnedFiles.length === 0 && <Text style={{marginLeft: 22, color: '#999'}}>No pinned files</Text>}
          {pinnedFiles.map(file => (
            <View key={file.id}>
                {renderSelectable(
                    <AudioFile 
                        {...file} 
                        onPress={() => handleItemPress(file.id, 'file')} 
                        onLongPress={() => handleLongPress(file, 'file')} 
                    />, file.id
                )}
            </View>
          ))}
        </View>

        {/* RECENT (Root) */}
        <Text style={[styles.sectionTitle, { color: themeColors.text, marginTop: 25 }]}>Recent</Text>
        <View style={styles.listContainer}>
          {recentFiles.length === 0 && <Text style={{marginLeft: 22, color: '#999'}}>No recent files</Text>}
          {recentFiles.map(file => (
             <View key={file.id}>
                {renderSelectable(
                    <AudioFile 
                        {...file} 
                        onPress={() => handleItemPress(file.id, 'file')} 
                        onLongPress={() => handleLongPress(file, 'file')} 
                    />, file.id
                )}
            </View>
          ))}
        </View>

      </ScrollView>

      <ActionModal 
        visible={actionModalVisible}
        onClose={() => {
            setActionModalVisible(false);
            setIsCreating(false); 
        }}
        initialMode={modalMode}
        title={isCreating ? '' : (targetFile ? targetFile.title : targetFolder?.name || '')}
        type={(targetFile || (!isCreating && !targetFolder)) ? 'file' : 'folder'} 
        isPinned={targetFile?.isPinned}
        currentColor={targetFolder?.color}
        
        onMove={handleOpenMove} 

        onDelete={() => {
            const id = targetFile?.id || targetFolder?.id;
            if (id) deleteItems(new Set([id]));
            setActionModalVisible(false);
        }}
        
        onRename={(newName, newColor) => {
            const wasCreating = isCreating;
            const targetId = targetFile?.id || targetFolder?.id;

            setActionModalVisible(false);
            setIsCreating(false);

            setTimeout(() => {
                if (wasCreating) {
                   const newId = createFolder(newName, null);
                   if (newColor && newId) {
                       renameItem(newId, newName, newColor);
                   }
                } else {
                   if (targetId) {
                       renameItem(targetId, newName, newColor);
                   }
                }
            }, 100);
        }}
        
        onTogglePin={() => {
            if(targetFile) togglePin(targetFile.id);
            setActionModalVisible(false);
        }}
      />

      <OptionsModal 
        visible={optionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        onCreateFolder={handleCreateFolder}
        onEnterSelectionMode={() => {
          setOptionsModalVisible(false);
          setIsSelectionMode(true);
          setSelectedIds(new Set()); 
        }}
      />

      {/* ✅ FIX 3: Added MoveFileModal Component here */}
      <MoveFileModal 
        visible={moveModalVisible}
        onClose={() => setMoveModalVisible(false)}
        folders={availableFolders}
        onSelectFolder={executeMove}
        movingItems={getMovingItems()}
      />
        
      {isSelectionMode && (
        <View style={[styles.batchBar, { backgroundColor: themeColors.container, borderTopColor: themeColors.bordercolorSelected }]}>
          <TouchableOpacity onPress={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }}>
            <Text style={{ fontSize: 16, color: themeColors.text }}>Cancel</Text>
          </TouchableOpacity>
          
          <Text style={{ fontWeight: 'bold', color: themeColors.text }}>{selectedIds.size} Selected</Text>
          
          <View style={{ flexDirection: 'row', gap: 20 }}>
             <TouchableOpacity onPress={handleOpenMove} disabled={selectedIds.size === 0}>
                <Text style={{ fontSize: 16, color: themeColors.tint, opacity: selectedIds.size === 0 ? 0.3 : 1 }}>Move</Text>
             </TouchableOpacity>

             <TouchableOpacity onPress={handleBatchDelete} disabled={selectedIds.size === 0}>
                <Text style={{ fontSize: 16, color: 'red', opacity: selectedIds.size === 0 ? 0.3 : 1 }}>Delete</Text>
             </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}

// --- INTERNAL COMPONENT: OptionsModal ---
function OptionsModal({ visible, onClose, onCreateFolder, onEnterSelectionMode }: any) {
  const theme = useColorScheme() ?? 'light';
  const themeColors = Colors[theme];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.menuContainer, { backgroundColor: themeColors.container }]}>

          <Text style={[styles.menuHeader, { color: themeColors.text }]}>Options</Text>
          
          <TouchableOpacity style={styles.menuOption} onPress={onCreateFolder}>
            <Text style={{ fontSize: 16, color: themeColors.tint, fontWeight: '600' }}>+ Create New Folder</Text>
          </TouchableOpacity>
          
          <View style={{ height: 1, backgroundColor: '#ccc', opacity: 0.2, width: '100%' }} />

          <TouchableOpacity style={styles.menuOption} onPress={onEnterSelectionMode}>
            <Text style={{ fontSize: 16, color: themeColors.text }}>Select Items</Text>
          </TouchableOpacity>

        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 22, marginBottom: 15 },
  listContainer: { marginBottom: 5 },
  checkbox: { position: 'absolute', top: -8, right: -8, zIndex: 10, width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#ccc', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  batchBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, paddingBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, borderTopWidth: 1, elevation: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  menuContainer: { width: 250, borderRadius: 15, paddingVertical: 10, elevation: 10 },
  menuHeader: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  menuOption: { paddingVertical: 15, alignItems: 'center' },
});
