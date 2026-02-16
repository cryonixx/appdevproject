import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

// --- IMPORTS ---
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Redirect, Stack, useLocalSearchParams, useRouter } from "expo-router";

// ✅ CUSTOM COMPONENTS
<<<<<<< HEAD
import ActionModal from '@/components/ActionModal';
import AudioFile from '@/components/AudioFileItem';
import MoveFileModal from '@/components/MoveFileModal';
import OptionsModal from '@/components/OptionsModal';
import PersistentSearchBar from '@/components/PersistentSearchBar'; // ✅ 1. IMPORT ADDED HERE
import { EventBus } from '@/constants/eventsBus';
import { useSearch } from '@/contexts/SearchContext'; // ✅ Add this import
=======
import ActionModal from "@/components/ActionModal";
import AudioFile from "@/components/AudioFileItem";
import MoveFileModal from "@/components/MoveFileModal";
import OptionsModal from "@/components/OptionsModal";
import PersistentSearchBar from "@/components/PersistentSearchBar"; // ✅ 1. IMPORT ADDED HERE
import { EventBus } from "@/constants/eventsBus";
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)

import { FileSystemItem, useFileSystem } from "@/contexts/FileSystemContext";

export default function FolderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

<<<<<<< HEAD
    // --- UI STATES ---
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [moveVisible, setMoveVisible] = useState(false);
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [targetItem, setTargetItem] = useState<FileSystemItem | null>(null);
    const [modalMode, setModalMode] = useState<'menu' | 'rename'>('menu');
    const { searchQuery } = useSearch();
=======
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)

  const { items, createFolder, moveItems, renameItem, deleteItems, togglePin } =
    useFileSystem();

  // --- UI STATES ---
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [moveVisible, setMoveVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [targetItem, setTargetItem] = useState<FileSystemItem | null>(null);
  const [modalMode, setModalMode] = useState<"menu" | "rename">("menu");

  // --- SELECTION STATES ---
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  if (!items)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  // Data Filtering
  const currentFolder = items.find((i) => i.id === id);

  // THE BOUNCER
  if (!currentFolder) {
    return <Redirect href="/" />;
  }

  const folderName = currentFolder.title;
  const foldersInside = items.filter(
    (i) => i.parentId === id && i.type === "folder",
  );
  const filesInside = items.filter(
    (i) => i.parentId === id && i.type === "file",
  );

  // --- HELPER: Get Set of Items being acted upon ---
  const getMovingItems = () => {
    if (isSelectionMode) return selectedIds;
    return targetItem?.id ? new Set([targetItem.id]) : new Set<string>();
  };

  // --- HANDLERS ---

  const handleItemPress = (id: string) => {
    if (isSelectionMode) {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
    } else {
      const item = items.find((i) => i.id === id);
      if (item?.type === "folder") {
        router.push(`/folder/${id}`);
      } else {
        console.log("Play", id);
      }
    }
  };

  const handleBatchDelete = () => {
    const idsToDelete = new Set(selectedIds);

    const executeDelete = () => {
      deleteItems(idsToDelete);
      setIsSelectionMode(false);
      setSelectedIds(new Set());
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm(`Delete ${selectedIds.size} items?`);
      if (confirmed) executeDelete();
      return;
    }

<<<<<<< HEAD
    const folderName = currentFolder.title; 
    // ✅ 2. FIX: Added Search Results Logic
    const searchResults = React.useMemo(() => {
        if (!searchQuery) return [];
        return items.filter(item => 
            item.parentId === id &&
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [items, searchQuery, id]);

    // ✅ 3. FIX: Use useMemo for stability while typing
    const foldersInside = React.useMemo(() => 
        items.filter(i => i.parentId === id && i.type === 'folder'), 
    [items, id]);

    const filesInside = React.useMemo(() => 
        items.filter(i => i.parentId === id && i.type === 'file'), 
    [items, id]);

=======
    Alert.alert("Delete Items", `Delete ${selectedIds.size} items?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: executeDelete,
      },
    ]);
  };
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)

  const handleCreateRequest = () => {
    setOptionsModalVisible(false);
    setTargetItem(null);
    setIsCreating(true);
    setModalMode("rename");
    setTimeout(() => setActionModalVisible(true), 500);
  };

  const handleEditRequest = (item: FileSystemItem) => {
    if (isSelectionMode) return;
    setTargetItem(item);
    setIsCreating(false);
    setModalMode("menu");
    setActionModalVisible(true);
  };

  const handleMove = (targetFolderId: string | null) => {
    const idsToMove = getMovingItems();

    if (idsToMove.size > 0) {
      moveItems(idsToMove, targetFolderId);
    }

    setMoveVisible(false);
    setIsSelectionMode(false);
    setSelectedIds(new Set());
    setTargetItem(null);
  };

  const handleDelete = () => {
    const id = targetItem?.id;
    if (id) {
      deleteItems(new Set([id]));
      setActionModalVisible(false);
      setTargetItem(null);
    }
  };

  const handleTogglePin = () => {
    if (targetItem) {
      togglePin(targetItem.id);
      setActionModalVisible(false);
    }
  };

  const renderSelectable = (component: React.ReactNode, id: string) => {
    const isSelected = selectedIds.has(id);
    return (
      <View
        key={id}
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

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = EventBus.onOpenSettings(() =>
        setOptionsModalVisible(true),
      );
      return () => unsubscribe();
    }, []),
  );

  const availableFolders = items
    .filter((i) => i.type === "folder" && !getMovingItems().has(i.id))
    .map((f) => ({ id: f.id, name: f.title, folderId: f.parentId }));

  const FolderTopHeader = () => {
    const colorScheme = useColorScheme() ?? "light";
    const themeColors = Colors[colorScheme];

    

    return (
<<<<<<< HEAD
        <View style={{ flex: 1, backgroundColor: themeColors.background }}>
            <Stack.Screen options={{ headerShown: false }} />
            <FolderTopHeader />
            

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}>
                
                {/* 👇 UPDATE THIS SECTION INSIDE THE SCROLLVIEW */}
                {searchQuery.length > 0 ? (
                    <View style={{ paddingHorizontal: 22, paddingTop: 10 }}>
                        <Text style={[styles.sectionHeader, { marginLeft: 0, color: themeColors.text }]}>
                            Search Results ({searchResults.length})
                        </Text>

                        {/* ✅ ADDED INDICATOR LOGIC HERE */}
                        {searchResults.length === 0 ? (
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <Ionicons name="search-outline" size={40} color="#999" style={{ marginBottom: 10 }} />
                                <Text style={{ color: '#999', fontSize: 16, textAlign: 'center' }}>
                                    No matches found in this folder for "{searchQuery}"
                                </Text>
                            </View>
                        ) : (
                            // If results exist, map them as usual
                            searchResults.map(item => (
                                <View key={item.id} style={{ marginTop: 10 }}>
                                    {item.type === 'folder' ? (
                                        renderSelectable(
                                            <TouchableOpacity 
                                                style={[styles.folderCard, { backgroundColor: item.color || themeColors.container }]}
                                                onPress={() => handleItemPress(item.id)}
                                                onLongPress={() => handleEditRequest(item)}
                                            >
                                                <Ionicons name="folder" size={24} color={themeColors.text} />
                                                <Text style={[styles.folderText, { color: themeColors.text }]}>{item.title}</Text>
                                            </TouchableOpacity>, item.id
                                        )
                                    ) : (
                                        renderSelectable(
                                            <AudioFile 
                                                id={item.id}
                                                title={item.title}
                                                date={item.date}
                                                duration={item.duration}
                                                isPinned={item.isPinned}
                                                onPress={() => handleItemPress(item.id)}
                                                onLongPress={() => handleEditRequest(item)}
                                            />, item.id
                                        )
                                    )}
                                </View>
                            ))
                        )}
                    </View>
                ) : (
                    
                    
                    <>
                        <View style={styles.titleRow}>
                            <TouchableOpacity 
                                style={{ marginRight: 10 }}
                                onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
                            >
                                <Ionicons name="chevron-back" size={32} color={themeColors.tint} />
                            </TouchableOpacity>
                            <Ionicons name="folder-open" size={28} color={themeColors.tint} style={{ marginRight: 10 }} />
                            <Text style={[styles.pageTitle, { color: themeColors.text }]}>{folderName}</Text>
                        </View>

                        {/* --- FOLDERS SECTION --- */}
                        {foldersInside.length > 0 && (
                            <View style={styles.section}>
                                <Text style={[styles.sectionHeader, { color: themeColors.text }]}>Folders</Text>
                                {foldersInside.map(folder => 
                                    renderSelectable(
                                        <TouchableOpacity 
                                            key={folder.id} 
                                            style={[styles.folderCard, { backgroundColor: folder.color || themeColors.container }]}
                                            onPress={() => handleItemPress(folder.id)}
                                            onLongPress={() => handleEditRequest(folder)}
                                        >
                                            <Ionicons name="folder" size={24} color={themeColors.text} />
                                            <Text style={[styles.folderText, { color: themeColors.text }]} numberOfLines={1}>{folder.title}</Text>
                                            <Ionicons name="chevron-forward" size={20} color={themeColors.text} style={{ opacity: 0.3 }} />
                                        </TouchableOpacity>,
                                        folder.id
                                    )
                                )}
                            </View>
                        )}

                        {/* --- FILES SECTION --- */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionHeader, { color: themeColors.text }]}>Files</Text>
                            {filesInside.length > 0 ? (
                                filesInside.map(file => 
                                    renderSelectable(
                                        <AudioFile 
                                            id={file.id} // ✅ 5. FIX: Added missing ID here
                                            key={file.id} 
                                            title={file.title}
                                            date={file.date || "Unknown Date"}       
                                            duration={file.duration || "00:00"}
                                            isPinned={file.isPinned || false}
                                            onPress={() => handleItemPress(file.id)} 
                                            onLongPress={() => handleEditRequest(file)}
                                        />,
                                        file.id
                                    )
                                )
                            ) : (
                                <Text style={[styles.emptyText, { color: themeColors.text }]}>No files in this folder</Text>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>

            {/* BATCH BAR / SEARCH BAR LOGIC */}
            {isSelectionMode ? (
                /* ... (Keep your batchBar code) */
                <View style={[styles.batchBar, { backgroundColor: themeColors.container, borderTopColor: themeColors.bordercolorSelected }]}>
                    <TouchableOpacity onPress={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }}>
                        <Text style={{ fontSize: 16, color: themeColors.text }}>Cancel</Text>
                    </TouchableOpacity>

                    <Text style={{ fontWeight: 'bold', color: themeColors.text }}>{selectedIds.size} Selected</Text>

                    <View style={{ flexDirection: 'row', gap: 20 }}>

                        <TouchableOpacity onPress={() => setMoveVisible(true)} disabled={selectedIds.size === 0}>
                            <Text style={{ fontSize: 16, color: themeColors.tint, opacity: selectedIds.size === 0 ? 0.3 : 1 }}>Move</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleBatchDelete} disabled={selectedIds.size === 0}>
                            <Text style={{ fontSize: 16, color: 'red', opacity: selectedIds.size === 0 ? 0.3 : 1 }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <PersistentSearchBar />
            )}

            {/* --- MODALS --- */}
            <OptionsModal 
                visible={optionsModalVisible} 
                onClose={() => setOptionsModalVisible(false)}
                onCreateFolder={handleCreateRequest} 
                onEnterSelectionMode={() => {
                    setOptionsModalVisible(false);
                    setIsSelectionMode(true);
                }}
            /> 

            <ActionModal 
                visible={actionModalVisible}
                onClose={() => setActionModalVisible(false)}
                title={isCreating ? '' : targetItem?.title || ''}
                isPinned={targetItem?.isPinned}
                currentColor={targetItem?.color} 
                type={targetItem?.type === 'file' ? 'file' : 'folder'}
                initialMode={modalMode} 
                onMove={() => {
                    setActionModalVisible(false);
                    setTimeout(() => setMoveVisible(true), 300);
                }}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
                // ✅ 6. FIX: Added async/await for Promise Error
                onRename={async (name, color) => {
                    const wasCreating = isCreating;
                    const targetId = targetItem?.id;
                    setActionModalVisible(false);
                    
                    if (wasCreating) {
                        // Pass color directly to createFolder (it's supported in your context)
                        await createFolder(name, id, color); 
                    } else if (targetId) {
                        renameItem(targetId, name, color);
                    }
                    setIsCreating(false);
                }}
            /> 

            <MoveFileModal 
                visible={moveVisible}
                onClose={() => setMoveVisible(false)}
                folders={availableFolders}
                onSelectFolder={handleMove}
                movingItems={getMovingItems()}
            /> 
        </View>
=======
      <View
        style={[
          styles.container,
          {
            backgroundColor: themeColors.background,
            borderBottomColor: themeColors.bordercolorSelected,
          },
        ]}
      >
        <Text style={[styles.staticTitle, { color: themeColors.tint }]}>
          Audio Notes
        </Text>

        <TouchableOpacity
          onPress={() => EventBus.emitOpenSettings()}
          activeOpacity={0.7}
          style={styles.settingsButton}
        >
          <Image
            key={colorScheme}
            source={require("@/assets/images/settings_icon.png")}
            style={{
              width: 40,
              height: 40,
              resizeMode: "contain",
              tintColor: themeColors.tint,
            }}
          />
        </TouchableOpacity>
      </View>
>>>>>>> 8dc6885 (feat: created the useWhisperModels hook)
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <FolderTopHeader />

      {/* Added style={{ flex: 1 }} to push the bottom bars down accurately */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
      >
        <View style={styles.titleRow}>
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)");
              }
            }}
          >
            <Ionicons name="chevron-back" size={32} color={themeColors.tint} />
          </TouchableOpacity>

          <Ionicons
            name="folder-open"
            size={28}
            color={themeColors.tint}
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.pageTitle, { color: themeColors.text }]}>
            {folderName}
          </Text>
        </View>

        {/* --- FOLDERS SECTION --- */}
        {foldersInside.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionHeader, { color: themeColors.text }]}>
              Folders
            </Text>
            {foldersInside.map((folder) =>
              renderSelectable(
                <TouchableOpacity
                  key={folder.id}
                  style={[
                    styles.folderCard,
                    { backgroundColor: folder.color || themeColors.container },
                  ]}
                  onPress={() => handleItemPress(folder.id)}
                  onLongPress={() => handleEditRequest(folder)}
                  delayLongPress={200}
                >
                  <Ionicons name="folder" size={24} color={themeColors.text} />
                  <Text
                    style={[styles.folderText, { color: themeColors.text }]}
                    numberOfLines={1}
                  >
                    {folder.title}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={themeColors.text}
                    style={{ opacity: 0.3 }}
                  />
                </TouchableOpacity>,
                folder.id,
              ),
            )}
          </View>
        )}

        {/* --- FILES SECTION --- */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: themeColors.text }]}>
            Files
          </Text>
          {filesInside.length > 0 ? (
            filesInside.map((file) =>
              renderSelectable(
                <AudioFile
                  key={file.id}
                  title={file.title}
                  date={file.date || "Unknown Date"}
                  duration={file.duration || "00:00"}
                  isPinned={file.isPinned || false}
                  onPress={() => handleItemPress(file.id)}
                  onLongPress={() => handleEditRequest(file)}
                />,
                file.id,
              ),
            )
          ) : (
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              No files in this folder
            </Text>
          )}
        </View>
      </ScrollView>

      {/* ✅ 2. BOTTOM BAR LOGIC: Toggle between Search Bar and Batch Action Bar */}
      {isSelectionMode ? (
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
              onPress={() => setMoveVisible(true)}
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
      ) : (
        <PersistentSearchBar />
      )}

      {/* --- MODALS --- */}
      <OptionsModal
        visible={optionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        onCreateFolder={handleCreateRequest}
        onEnterSelectionMode={() => {
          setOptionsModalVisible(false);
          setIsSelectionMode(true);
        }}
      />

      <ActionModal
        visible={actionModalVisible}
        onClose={() => setActionModalVisible(false)}
        title={isCreating ? "" : targetItem?.title || ""}
        isPinned={targetItem?.isPinned}
        currentColor={targetItem?.color}
        type={targetItem?.type === "file" ? "file" : "folder"}
        initialMode={modalMode}
        onMove={() => {
          setActionModalVisible(false);
          setTimeout(() => setMoveVisible(true), 300);
        }}
        onDelete={handleDelete}
        onTogglePin={handleTogglePin}
        onRename={(name, color) => {
          const wasCreating = isCreating;
          const targetId = targetItem?.id;
          setActionModalVisible(false);
          setTimeout(() => {
            if (wasCreating) {
              const newId = createFolder(name, id);
              if (color) renameItem(newId, name, color);
            } else if (targetId) {
              renameItem(targetId, name, color);
            }
            setIsCreating(false);
          }, 100);
        }}
      />

      <MoveFileModal
        visible={moveVisible}
        onClose={() => setMoveVisible(false)}
        folders={availableFolders}
        onSelectFolder={handleMove}
        movingItems={getMovingItems()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... [KEEP ALL YOUR EXISTING STYLES EXACTLY THE SAME]
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 22,
    marginTop: 10,
    marginBottom: 10,
  },
  pageTitle: { fontSize: 26, fontWeight: "bold" },
  section: { marginTop: 15 },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    opacity: 0.5,
    marginLeft: 24,
    marginBottom: 10,
  },
  folderCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 14,
    marginBottom: 8,
  },
  folderText: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: "500" },
  emptyText: { textAlign: "center", marginTop: 20, opacity: 0.5 },
  checkbox: {
    position: "absolute",
    top: -8,
    right: 12,
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
  container: {
    height: 115,
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingLeft: 20,
    borderBottomWidth: 3,
    position: "relative",
  },
  staticTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 5,
  },
  settingsButton: {
    position: "absolute",
    right: 20,
    bottom: 21,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
