import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

interface FolderData {
  id: string;
  name: string;
  color?: string;
  folderId?: string | null; // Parent ID
}

interface MoveFileModalProps {
  visible: boolean;
  onClose: () => void;
  folders: FolderData[];
  onSelectFolder: (folderId: string | null) => void;
  movingItems: Set<string>;
}

export default function MoveFileModal({
  visible,
  onClose,
  folders,
  onSelectFolder,
  movingItems,
}: MoveFileModalProps) {
  const themeColors = Colors[useColorScheme() ?? "light"];

  // Track current path in the modal navigation
  const [currentPathId, setCurrentPathId] = useState<string | null>(null);

  useEffect(() => {
    if (visible) setCurrentPathId(null); // Always start at Root
  }, [visible]);

  // Folders to display: Children of current path AND not being moved
  const displayFolders = folders.filter(
    (f) => f.folderId === currentPathId && !movingItems.has(f.id),
  );

  const currentFolderObj = folders.find((f) => f.id === currentPathId);

  const handleBack = () => {
    if (currentFolderObj) setCurrentPathId(currentFolderObj.folderId || null);
    else setCurrentPathId(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[styles.container, { backgroundColor: themeColors.container }]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            {currentPathId !== null && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={themeColors.text}
                />
              </TouchableOpacity>
            )}
            <Text style={[styles.headerTitle, { color: themeColors.text }]}>
              {currentPathId === null ? "Main Drive" : currentFolderObj?.name}
            </Text>
          </View>

          {/* List */}
          <FlatList
            data={displayFolders}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={{ padding: 20, color: "#999", textAlign: "center" }}>
                No subfolders
              </Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.folderItem,
                  { borderBottomColor: themeColors.bordercolorSelected },
                ]}
                onPress={() => setCurrentPathId(item.id)} // Enter folder
              >
                <Ionicons
                  name="folder"
                  size={24}
                  color={item.color || "#666"}
                />
                <Text style={[styles.folderName, { color: themeColors.text }]}>
                  {item.name}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={themeColors.lightext}
                />
              </TouchableOpacity>
            )}
          />

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.footerBtn}>
              <Text style={{ color: "red", fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.moveBtn,
                { backgroundColor: themeColors.container },
              ]}
              onPress={() => onSelectFolder(currentPathId)} // Confirm Move
            >
              <Text style={{ color: themeColors.text, fontWeight: "bold" }}>
                {currentPathId === null ? "Move to Root" : "Move Here"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: { width: "85%", height: "55%", borderRadius: 16, padding: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  backButton: { padding: 5 },
  folderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    gap: 15,
  },
  folderName: { flex: 1, fontSize: 16 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  footerBtn: { padding: 10 },
  moveBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
});
