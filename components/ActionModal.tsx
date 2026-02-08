import { Colors } from "@/constants/theme";
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, StyleSheet,
  Text, TextInput, TouchableOpacity, View, useColorScheme
} from 'react-native';

interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  // Data passed in
  title: string;
  isPinned?: boolean; // Optional, because folders don't have pins
  type: 'file' | 'folder' | null;
  
  // Actions
  onDelete: () => void;
  onRename: (newName: string) => void;
  onTogglePin?: () => void;
}

export default function ActionModal({ 
  visible, onClose, title, isPinned, type, 
  onDelete, onRename, onTogglePin 
}: ActionModalProps) {
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme] || Colors.light;

  const [mode, setMode] = useState<'menu' | 'rename'>('menu');
  const [inputText, setInputText] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setMode('menu');
      setInputText(title);
    }
  }, [visible, title]);

  const handleSave = () => {
    if (inputText.trim()) {
      onRename(inputText);
    }
    // Mode resets via the useEffect above when visible becomes false
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { backgroundColor: themeColors.container }]}>
          
          <Text style={[styles.modalHeader, { color: themeColors.text }]}>
            {mode === 'rename' ? "Rename" : title}
          </Text>

          {mode === 'rename' ? (
            // --- RENAME MODE ---
            <>
              <TextInput 
                style={[styles.input, { color: themeColors.text, borderColor: themeColors.bordercolorSelected }]}
                value={inputText}
                onChangeText={setInputText}
                autoFocus={true}
                selectTextOnFocus={true}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalBtn} onPress={() => setMode('menu')}>
                  <Text style={{ color: themeColors.text }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: 'rgba(150,150,150,0.1)'  }]} onPress={handleSave}>
                  <Text style={{ color: themeColors.text }}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // --- MENU MODE ---
            <>
              {type === 'file' && onTogglePin && (
                <>
                  <TouchableOpacity style={styles.optionRow} onPress={onTogglePin}>
                    <Text style={[styles.optionText, { color: themeColors.text }]}>
                      {isPinned ? "Unpin Note" : "Pin to Top"}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.divider} />
                </>
              )}

              <TouchableOpacity style={styles.optionRow} onPress={() => setMode('rename')}>
                <Text style={[styles.optionText, { color: themeColors.text }]}>Rename</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.optionRow} onPress={onDelete}>
                <Text style={[styles.optionText, { color: 'red' }]}>Delete</Text>
              </TouchableOpacity>

              <View style={[styles.divider, { marginTop: 10 }]} />
              
              <TouchableOpacity style={styles.optionRow} onPress={onClose}>
                <Text style={[styles.optionText, { color: themeColors.lightext }]}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    width: '80%', borderRadius: 20, padding: 20, elevation: 5,
  },
  modalHeader: {
    fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center',
  },
  optionRow: { paddingVertical: 15, alignItems: 'center' },
  optionText: { fontSize: 16, fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(150,150,150,0.2)', width: '100%' },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  modalBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', backgroundColor: 'rgba(150,150,150,0.1)' }
});