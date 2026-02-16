<<<<<<< HEAD
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
=======
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)

// --- IMPORTS ---
import { EventBus } from "@/constants/eventsBus";
import { Colors } from "@/constants/theme";
<<<<<<< HEAD

  

// ✅ CUSTOM COMPONENTS
import ActionModal from '@/components/ActionModal';
import AudioFile from '@/components/AudioFileItem';
import Folder, { FolderData } from '@/components/folder';

import MoveFileModal from '@/components/MoveFileModal';

// ✅ IMPORT CONTEXTS
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useSearch } from '@/contexts/SearchContext'; // 👈 IMPORT SEARCH CONTEXT
=======
import { useFocusEffect } from "@react-navigation/native";

// ✅ CUSTOM COMPONENTS
import ActionModal from "@/components/ActionModal";
import AudioFile from "@/components/AudioFileItem";
import Folder, { FolderData } from "@/components/folder";
import { useRouter } from "expo-router";
// ✅ Ensure this is imported
import MoveFileModal from "@/components/MoveFileModal";

// ✅ IMPORT CONTEXT
import { useFileSystem } from "@/contexts/FileSystemContext";
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)

// --- TYPES ---
interface RecordingFile {
  id: string;
  title: string;
  date: string;
  duration: string;
  isPinned: boolean;
  folderId?: string | null;
}
interface ExtendedFolderData extends FolderData {
  folderId?: string | null;
}

export default function HomeScreen() {
  const router = useRouter();
<<<<<<< HEAD
  const colorScheme = useColorScheme() ?? 'light';

=======
  const colorScheme = useColorScheme() ?? "light";
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)
  const themeColors = Colors[colorScheme] || Colors.light;
  

  // --- CONTEXT HOOKS ---
  const { items, createFolder, moveItems, deleteItems, togglePin, renameItem } = useFileSystem();
  const { searchQuery } = useSearch(); // 👈 GET SEARCH QUERY

  // --- UI STATES ---
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [modalMode, setModalMode] = useState<'menu' | 'rename'>('menu');

  // --- SELECTION ---
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // --- TARGETS ---
  const [targetFile, setTargetFile] = useState<RecordingFile | null>(null);
  const [targetFolder, setTargetFolder] = useState<ExtendedFolderData | null>(null);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = EventBus.onOpenSettings(() => {
        setOptionsModalVisible(true);
      });
      return () => {
        unsubscribe();
      };
    }, []),
  );
<<<<<<< HEAD

  // --- DATA FILTERING ---
=======
  const [modalMode, setModalMode] = useState<"menu" | "rename">("menu");

  // --- DATA ---
  const { items, createFolder, moveItems, deleteItems, togglePin, renameItem } =
    useFileSystem();
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)

  const searchResults = React.useMemo(() => {
    if (!searchQuery) return [];
    
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ✅ DEBUG INDICATOR: Watch your terminal to see the search working in real-time
    console.log(`Search: "${searchQuery}" | Matches: ${filtered.length}`);
    
    return filtered;
  }, [items, searchQuery]);

<<<<<<< HEAD
  const rootFolders = React.useMemo(() => items
    .filter(i => i.type === 'folder' && i.parentId === null)
    .map(i => ({ 
        id: i.id, 
        name: i.title, 
        color: i.color || '#666', 
        folderId: i.parentId 
    })), [items]);

  const pinnedFiles = React.useMemo(() => items
    .filter(i => i.type === 'file' && i.isPinned && i.parentId === null) 
    .map(i => ({ id: i.id, title: i.title, date: i.date, duration: i.duration, isPinned: i.isPinned, folderId: i.parentId })), [items]);

  const recentFiles = React.useMemo(() => items
    .filter(i => i.type === 'file' && !i.isPinned && i.parentId === null)
    .map(i => ({ id: i.id, title: i.title, date: i.date, duration: i.duration, isPinned: i.isPinned, folderId: i.parentId })), [items]);
=======
  // --- TARGETS ---
  const [targetFile, setTargetFile] = useState<RecordingFile | null>(null);
  const [targetFolder, setTargetFolder] = useState<ExtendedFolderData | null>(
    null,
  );

  // --- FILTERING (Root Level) ---
  const rootFolders: ExtendedFolderData[] = items
    .filter((i) => i.type === "folder" && i.parentId === null)
    .map((i) => ({
      id: i.id,
      name: i.title,
      color: i.color || "#666",
      folderId: i.parentId,
    }));

  const rootFiles: RecordingFile[] = items
    .filter((i) => i.type === "file" && i.parentId === null)
    .map((i) => ({
      id: i.id,
      title: i.title,
      date: i.date,
      duration: i.duration,
      isPinned: i.isPinned,
      folderId: i.parentId,
    }));

  const pinnedFiles = items
    .filter((i) => i.type === "file" && i.isPinned)
    .filter((i) => i.parentId === null)
    .map((i) => ({
      id: i.id,
      title: i.title,
      date: i.date,
      duration: i.duration,
      isPinned: i.isPinned,
      folderId: i.parentId,
    }));

  const recentFiles = rootFiles.filter((f) => !f.isPinned);
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)


  // --- HELPER: RENDER SELECTABLE WRAPPER ---
  const renderSelectable = (component: React.ReactNode, id: string) => {
    const isSelected = selectedIds.has(id);
    return (
      <View
        style={{
          position: "relative",
          opacity: isSelectionMode && !isSelected ? 0.5 : 1,
        }}
      >
        {component}
        {isSelectionMode && (
          <View
            style={[
              styles.checkbox,
              isSelected && {
                backgroundColor: themeColors.tint,
                borderColor: themeColors.tint,
              },
            ]}
          >
            {isSelected && (
              <Text
                style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
              >
                ✓
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  // --- HANDLERS ---
  const handleItemPress = (id: string, type: "file" | "folder") => {
    if (isSelectionMode) {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
    } else {
      if (type === "folder") {
        router.push(`/folder/${id}`);
      } else {
        console.log(`Playing file ${id}`);
        // Add your playback logic here
      }
    }
  };

  const handleLongPress = (item: any, type: "file" | "folder") => {
    if (isSelectionMode) return;
    if (type === "file") {
      setTargetFile(item);
      setTargetFolder(null);
    } else {
      setTargetFolder(item);
      setTargetFile(null);
    }
    setModalMode("menu");
    setActionModalVisible(true);
  };

  // --- ACTIONS ---
  const handleCreateFolder = () => {
      setOptionsModalVisible(false);
      setIsCreating(true);         
      setTargetFolder(null);       
      setModalMode('rename');      
      setActionModalVisible(true);
  };

  const handleOpenMove = () => {
<<<<<<< HEAD
     if (targetFile || targetFolder) {
       setActionModalVisible(false);
       setTimeout(() => setMoveModalVisible(true), 300);
     }
     else if (isSelectionMode && selectedIds.size > 0) {
       setMoveModalVisible(true);
     }
=======
    if (targetFile || targetFolder) {
      setActionModalVisible(false);
      setTimeout(() => setMoveModalVisible(true), 300);
    } else if (isSelectionMode && selectedIds.size > 0) {
      setMoveModalVisible(true);
    }
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)
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

<<<<<<< HEAD
  const handleBatchDelete = () => {
    const idsToDelete = new Set(selectedIds);
    const executeDelete = () => {
      deleteItems(idsToDelete);
      setIsSelectionMode(false);
      setSelectedIds(new Set());
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Delete ${selectedIds.size} items?`);
      if (confirmed) executeDelete();
      return;
    }

    Alert.alert("Delete Items", `Delete ${selectedIds.size} items?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: 'destructive', onPress: executeDelete }
    ]);
  };


=======
  const handleCreateFolder = () => {
    setOptionsModalVisible(false);
    setTargetFolder(null);
    setTargetFile(null);
    setIsCreating(true);
    setModalMode("rename");
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
    if (Platform.OS === "web") {
      const confirmed = window.confirm(`Delete ${selectedIds.size} items?`);
      if (confirmed) executeDelete();
      return;
    }

    // Native Alert for iOS/Android
    Alert.alert("Delete Items", `Delete ${selectedIds.size} items?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: executeDelete,
      },
    ]);
  };

  // ✅ FIX 1: Helper to get the correct set of items being moved
  // This solves the TypeScript "undefined" error and Logic error
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)
  const getMovingItems = () => {
    if (isSelectionMode) return selectedIds;
    const id = targetFile?.id || targetFolder?.id;
    return id ? new Set([id]) : new Set<string>();
  };


  const availableFolders = items
    .filter((i) => i.type === "folder" && !getMovingItems().has(i.id))
    .map((f) => ({
      id: f.id,
      name: f.title,
      folderId: f.parentId,
    }));

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
<<<<<<< HEAD
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {/* 👇 SEARCH CONDITIONAL RENDERING */}
        {searchQuery.length > 0 ? (
          // --- SEARCH MODE ---
          <View style={{ paddingHorizontal: 22, paddingTop: 20 }}>
            {/* ✅ VISUAL INDICATOR: Shows exactly how many items were found */}
            <Text style={[styles.sectionTitle, { marginLeft: 0, color: themeColors.text }]}>
              Search Results ({searchResults.length})
            </Text>
            
            {searchResults.length === 0 ? (
               // ✅ EMPTY STATE INDICATOR: Confirms search ran but found nothing
               <View style={{ alignItems: 'center', marginTop: 50 }}>
                  <Text style={{ color: '#999', fontSize: 16 }}>No items found matching "{searchQuery}"</Text>
               </View>
            ) : (
               <View style={{ gap: 10 }}>
                 {searchResults.map(item => (
                   <View key={item.id}>
                     {item.type === 'folder' ? (
                        renderSelectable(
                           <Folder 
                              data={{ id: item.id, name: item.title, color: item.color || '#666' }} 
                              onPress={() => handleItemPress(item.id, 'folder')}
                              onLongPress={() => handleLongPress(item, 'folder')}
                           />, item.id
                        )
                     ) : (
                        renderSelectable(
                           <AudioFile 
                              id={item.id}
                              title={item.title}
                              date={item.date}
                              duration={item.duration}
                              isPinned={item.isPinned}
                              onPress={() => handleItemPress(item.id, 'file')}
                              onLongPress={() => handleLongPress(item, 'file')}
                           />, item.id
                        )
                     )}
                   </View>
                 ))}
               </View>
            )}
          </View>
        ) : (
          // --- NORMAL MODE ---
          <>
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
=======
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* FOLDERS (Root) */}
        <Text
          style={[
            styles.sectionTitle,
            { color: themeColors.text, marginTop: 20 },
          ]}
        >
          Folders
        </Text>
        <FlatList
          data={rootFolders}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: 22,
            paddingRight: 30,
            paddingTop: 10,
            gap: 15,
          }}
          extraData={selectedIds}
          renderItem={({ item }) =>
            renderSelectable(
              <Folder
                data={item}
                onPress={() => handleItemPress(item.id, "folder")}
                onLongPress={() => handleLongPress(item, "folder")}
              />,
              item.id,
            )
          }
        />

        {/* PINNED (Root) */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Pinned
        </Text>
        <View style={styles.listContainer}>
          {pinnedFiles.length === 0 && (
            <Text style={{ marginLeft: 22, color: "#999" }}>
              No pinned files
            </Text>
          )}
          {pinnedFiles.map((file) => (
            <View key={file.id}>
              {renderSelectable(
                <AudioFile
                  {...file}
                  onPress={() => handleItemPress(file.id, "file")}
                  onLongPress={() => handleLongPress(file, "file")}
                />,
                file.id,
              )}
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)
            </View>

<<<<<<< HEAD
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
          </>
        )}

      </ScrollView>

      {/* --- MODALS --- */}
      <ActionModal 
=======
        {/* RECENT (Root) */}
        <Text
          style={[
            styles.sectionTitle,
            { color: themeColors.text, marginTop: 25 },
          ]}
        >
          Recent
        </Text>
        <View style={styles.listContainer}>
          {recentFiles.length === 0 && (
            <Text style={{ marginLeft: 22, color: "#999" }}>
              No recent files
            </Text>
          )}
          {recentFiles.map((file) => (
            <View key={file.id}>
              {renderSelectable(
                <AudioFile
                  {...file}
                  onPress={() => handleItemPress(file.id, "file")}
                  onLongPress={() => handleLongPress(file, "file")}
                />,
                file.id,
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <ActionModal
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)
        visible={actionModalVisible}
        onClose={() => {
          setActionModalVisible(false);
          setIsCreating(false);
        }}
        action={isCreating ? 'create' : 'edit'}
        initialMode={modalMode}
<<<<<<< HEAD
        title={isCreating ? '' : (targetFile ? targetFile.title : targetFolder?.name || '')}
        type={(isCreating || (!targetFile && targetFolder)) ? 'folder' : 'file'}
        isPinned={targetFile?.isPinned}
        currentColor={isCreating ? '#666666' : targetFolder?.color}
        onMove={handleOpenMove} 

=======
        title={
          isCreating
            ? ""
            : targetFile
              ? targetFile.title
              : targetFolder?.name || ""
        }
        type={targetFile || (!isCreating && !targetFolder) ? "file" : "folder"}
        isPinned={targetFile?.isPinned}
        currentColor={targetFolder?.color}
        onMove={handleOpenMove}
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)
        onDelete={() => {
          const id = targetFile?.id || targetFolder?.id;
          if (id) deleteItems(new Set([id]));
          setActionModalVisible(false);
        }}
<<<<<<< HEAD


        onRename={(newName, newColor) => {
            if (isCreating) {
                createFolder(newName, null, newColor);
            } else {
                const targetId = targetFile?.id || targetFolder?.id;
                if (targetId) renameItem(targetId, newName, newColor);
            }
            setIsCreating(false);
            setActionModalVisible(false);
=======
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
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)
        }}
        onTogglePin={() => {
          if (targetFile) togglePin(targetFile.id);
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

<<<<<<< HEAD

      <MoveFileModal 
=======
      {/* ✅ FIX 3: Added MoveFileModal Component here */}
      <MoveFileModal
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)
        visible={moveModalVisible}
        onClose={() => setMoveModalVisible(false)}
        folders={availableFolders}
        onSelectFolder={executeMove}
        movingItems={getMovingItems()}
      />

      {isSelectionMode && (
        <View
          style={[
            styles.batchBar,
            {
              backgroundColor: themeColors.container,
              borderTopColor: themeColors.bordercolorSelected,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setIsSelectionMode(false);
              setSelectedIds(new Set());
            }}
          >
            <Text style={{ fontSize: 16, color: themeColors.text }}>
              Cancel
            </Text>
          </TouchableOpacity>

          <Text style={{ fontWeight: "bold", color: themeColors.text }}>
            {selectedIds.size} Selected
          </Text>

          <View style={{ flexDirection: "row", gap: 20 }}>
            <TouchableOpacity
              onPress={handleOpenMove}
              disabled={selectedIds.size === 0}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: themeColors.tint,
                  opacity: selectedIds.size === 0 ? 0.3 : 1,
                }}
              >
                Move
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBatchDelete}
              disabled={selectedIds.size === 0}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "red",
                  opacity: selectedIds.size === 0 ? 0.3 : 1,
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// --- INTERNAL COMPONENT: OptionsModal ---
function OptionsModal({
  visible,
  onClose,
  onCreateFolder,
  onEnterSelectionMode,
}: any) {
  const theme = useColorScheme() ?? "light";
  const themeColors = Colors[theme];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.menuContainer,
            { backgroundColor: themeColors.container },
          ]}
        >
          <Text style={[styles.menuHeader, { color: themeColors.text }]}>
            Options
          </Text>

          <TouchableOpacity style={styles.menuOption} onPress={onCreateFolder}>
            <Text
              style={{
                fontSize: 16,
                color: themeColors.tint,
                fontWeight: "600",
              }}
            >
              + Create New Folder
            </Text>
          </TouchableOpacity>

          <View
            style={{
              height: 1,
              backgroundColor: "#ccc",
              opacity: 0.2,
              width: "100%",
            }}
          />

          <TouchableOpacity
            style={styles.menuOption}
            onPress={onEnterSelectionMode}
          >
            <Text style={{ fontSize: 16, color: themeColors.text }}>
              Select Items
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 22,
    marginBottom: 15,
  },
  listContainer: { marginBottom: 5 },
  checkbox: {
    position: "absolute",
    top: -8,
    right: -8,
    zIndex: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  batchBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    borderTopWidth: 1,
    elevation: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    width: 250,
    borderRadius: 15,
    paddingVertical: 10,
    elevation: 10,
  },
  menuHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  menuOption: { paddingVertical: 15, alignItems: "center" },
});
