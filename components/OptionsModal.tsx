  import { Colors } from "@/constants/theme";
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

  interface OptionsModalProps {
    visible: boolean;
    onClose: () => void;
    onCreateFolder: () => void;
    onEnterSelectionMode: () => void;
  }

  // 1. Define the function (Don't export it yet)
  function OptionsModal({ visible, onClose, onCreateFolder, onEnterSelectionMode }: OptionsModalProps) {
    const theme = useColorScheme() ?? 'light';
    const themeColors = Colors[theme];

    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
          <View style={[styles.menu, { backgroundColor: themeColors.container }]}>
            <Text style={[styles.header, { color: themeColors.text }]}>Options</Text>
            <TouchableOpacity style={styles.option} onPress={onCreateFolder}>
              <Text style={[styles.optionText, { color: themeColors.tint }]}>+ Create New Folder</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.option} onPress={onEnterSelectionMode}>
              <Text style={[styles.optionText, { color: themeColors.text }]}>✓ Select Items</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    menu: { width: 250, borderRadius: 15, padding: 20, elevation: 10 },
    header: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    option: { paddingVertical: 12, alignItems: 'center' },
    optionText: { fontSize: 16, fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#ccc', opacity: 0.2, width: '100%' },
  });

  // 2. 👇 THE FIX: Export it BOTH ways
  export default OptionsModal; // Makes "import OptionsModal" work
  export { OptionsModal }; // Makes "import { OptionsModal }" work

