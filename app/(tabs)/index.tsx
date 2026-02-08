import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

// --- IMPORTS ---
import { EventBus } from '@/constants/eventsBus';
import { Colors } from "@/constants/theme";

// ✅ Keep these imports (assuming they are working)
import ActionModal from '@/components/ActionModal';
import AudioFile from '@/components/AudioFileItem';
import Folder, { FolderData } from '@/components/folder';

// ❌ REMOVED: import OptionsModal (We define it below to prevent the crash)

// --- TYPES ---
interface RecordingFile {
  id: string; title: string; date: string; duration: string; isPinned: boolean;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme] || Colors.light;

  // --- DATA ---
  const [folders, setFolders] = useState<FolderData[]>([
    { id: '1', name: 'AppDev', color: '#666666' },
    { id: '2', name: 'SoftEng', color: '#2196F3' },
  ]);

  const [files, setFiles] = useState<RecordingFile[]>([
    { id: '101', title: 'New Record', date: '01/31/26 12:34', duration: '20:00', isPinned: false },
    { id: '102', title: 'Lecture Notes', date: '01/30/26 09:15', duration: '45:30', isPinned: false },
    { id: '103', title: 'Important Exam', date: '02/01/26 10:00', duration: '50:00', isPinned: true },
  ]);

  // --- UI STATES ---
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // --- TARGETS ---
  const [targetFile, setTargetFile] = useState<RecordingFile | null>(null);
  const [targetFolder, setTargetFolder] = useState<FolderData | null>(null);

  // 1. EVENT LISTENER
  useEffect(() => {
    const unsubscribe = EventBus.onOpenSettings(() => {
      setOptionsModalVisible(true);
    });
    return unsubscribe;
  }, []);

  // 2. HANDLERS
  const handleItemPress = (id: string, type: 'file' | 'folder') => {
    if (isSelectionMode) {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
    } else {
      console.log(`Opening ${type} ${id}`);
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
    setActionModalVisible(true);
  };

  // 3. ACTIONS
  const handleCreateFolder = () => {
    setOptionsModalVisible(false);
    const newId = Date.now().toString();
    const newFolder = { id: newId, name: 'Untitled Folder', color: '#888' };
    setFolders(prev => [...prev, newFolder]);
    setTimeout(() => {
      setTargetFolder(newFolder);
      setTargetFile(null);
      setActionModalVisible(true);
    }, 100);
  };

  const handleBatchDelete = () => {
    Alert.alert("Delete Items", `Delete ${selectedIds.size} items?`, [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: 'destructive', 
        onPress: () => {
          setFiles(prev => prev.filter(f => !selectedIds.has(f.id)));
          setFolders(prev => prev.filter(f => !selectedIds.has(f.id)));
          setIsSelectionMode(false);
          setSelectedIds(new Set());
        }
      }
    ]);
  };

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

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {/* FOLDERS */}
        <Text style={[styles.sectionTitle, { color: themeColors.text, marginTop: 20 }]}>Folders</Text>
        <FlatList
          data={folders}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 22, gap: 15 }}
          renderItem={({ item }) => renderSelectable(
            <Folder 
              data={item} 
              onPress={() => handleItemPress(item.id, 'folder')}
              onLongPress={() => handleLongPress(item, 'folder')}
            />, item.id
          )}
        />

        {/* PINNED */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Pinned</Text>
        <View style={styles.listContainer}>
          {files.filter(f => f.isPinned).map(file => (
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

        {/* RECENT */}
        <Text style={[styles.sectionTitle, { color: themeColors.text, marginTop: 25 }]}>Recent</Text>
        <View style={styles.listContainer}>
          {files.filter(f => !f.isPinned).map(file => (
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

      {/* MODALS */}
      <ActionModal 
        visible={actionModalVisible}
        onClose={() => setActionModalVisible(false)}
        title={targetFile ? targetFile.title : targetFolder?.name || ''}
        isPinned={targetFile?.isPinned}
        type={targetFile ? 'file' : targetFolder ? 'folder' : null}
        onDelete={() => {
            if(targetFile) setFiles(prev => prev.filter(f => f.id !== targetFile.id));
            if(targetFolder) setFolders(prev => prev.filter(f => f.id !== targetFolder.id));
            setActionModalVisible(false);
        }}
        onRename={(newName) => {
            if(targetFile) setFiles(prev => prev.map(f => f.id === targetFile.id ? {...f, title: newName} : f));
            if(targetFolder) setFolders(prev => prev.map(f => f.id === targetFolder.id ? {...f, name: newName} : f));
            setActionModalVisible(false);
        }}
        onTogglePin={() => {
            if(targetFile) setFiles(prev => prev.map(f => f.id === targetFile.id ? {...f, isPinned: !f.isPinned} : f));
            setActionModalVisible(false);
        }}
      />

      {/* 👇 USING THE INTERNAL COMPONENT (No Imports = No Crash) */}
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

      {/* BATCH ACTION BAR */}
      {isSelectionMode && (
        <View style={[styles.batchBar, { backgroundColor: themeColors.container, borderTopColor: themeColors.bordercolorSelected }]}>
          <TouchableOpacity onPress={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }}>
            <Text style={{ fontSize: 16, color: themeColors.text }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold', color: themeColors.text }}>{selectedIds.size} Selected</Text>
          <TouchableOpacity onPress={handleBatchDelete} disabled={selectedIds.size === 0}>
             <Text style={{ fontSize: 16, color: 'red', opacity: selectedIds.size === 0 ? 0.3 : 1 }}>Delete ({selectedIds.size})</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

// --- INTERNAL COMPONENT DEFINITION ---
// We define this here to guarantee it exists and is a valid Function component.
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

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 22, marginBottom: 15 },
  listContainer: { marginBottom: 5 },
  checkbox: {
    position: 'absolute', top: -8, right: -8, zIndex: 10,
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: '#ccc', backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    elevation: 4
  },
  batchBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 80, paddingBottom: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 25, borderTopWidth: 1, elevation: 20
  },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  menuContainer: { width: 250, borderRadius: 15, paddingVertical: 10, elevation: 10 },
  menuHeader: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  menuOption: { paddingVertical: 15, alignItems: 'center' },
});
  