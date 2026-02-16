import { Colors } from "@/constants/theme";
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, StyleSheet,
  Text, TextInput, TouchableOpacity, View, useColorScheme
} from 'react-native';

interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  onMove?: () => void;
  
  title: string;
  isPinned?: boolean;
  type: 'file' | 'folder' | null;
  currentColor?: string;

  // 👇 ADD THIS PROP
  action?: 'create' | 'edit'; 

  onDelete: () => void;
  onRename: (newName: string, newColor?: string) => void;
  onTogglePin?: () => void;
  initialMode?: 'menu' | 'rename'; 
}

export default function ActionModal({ 
  visible, onClose, title, isPinned, type, currentColor,
  onDelete, onRename, onTogglePin, onMove,
  initialMode = 'menu',
  action = 'edit' // 👈 DEFAULT TO EDIT
}: ActionModalProps) {
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme] || Colors.light;

  const [mode, setMode] = useState<'menu' | 'rename'>('menu');
  const [inputText, setInputText] = useState('');
  const [selectedColor, setSelectedColor] = useState(currentColor || '#666666');
  
  useEffect(() => {
    if (visible) {
      setMode(initialMode); 
      setInputText(title);
      setSelectedColor(currentColor || '#666666');
    }
  }, [visible, title, initialMode, currentColor]);

  const handleSave = () => {
    if (inputText.trim()) {
      onRename(inputText, selectedColor);
    }
  };

  // Helper to determine Header Text
  const getHeaderText = () => {
    if (mode === 'rename') {
      if (action === 'create') return "New Folder";
      return type === 'folder' ? "Edit Folder" : "Rename File";
    }
    return title;
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
          
          {/* 👇 UPDATED HEADER LOGIC */}
          <Text style={[styles.modalHeader, { color: themeColors.text }]}>
            {getHeaderText()}
          </Text>

          {mode === 'rename' ? (
            <>
              <TextInput 
                placeholder="Enter Name..."
                placeholderTextColor={themeColors.lightext}
                style={[styles.input, { color: themeColors.text, borderColor: themeColors.bordercolorSelected }]}
                value={inputText}
                onChangeText={setInputText}
                autoFocus={true} 
                selectTextOnFocus={true}
              />

              {type === 'folder' && (
                <View style={styles.colorContainer}>
                  <Text style={[styles.colorLabel, { color: themeColors.text }]}>Color:</Text>
                  <View style={styles.colorRow}>
                    {themeColors.available_colors.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorCircle, 
                          { backgroundColor: color },
                          selectedColor === color && styles.colorSelected 
                        ]}
                        onPress={() => setSelectedColor(color)}
                      />
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalBtn} onPress={() => onClose()}>
                  <Text style={{ color: themeColors.text }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: 'rgba(150,150,150,0.1)' }]} onPress={handleSave}>
                  {/* 👇 BUTTON SAYS CREATE OR SAVE */}
                  <Text style={{ color: themeColors.text }}>
                    {action === 'create' ? "Create" : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
             // ... (Keep your existing Menu Mode code here, it is unchanged) ...
             // Just copy the Menu Mode section from your previous code
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
               <Text style={[styles.optionText, { color: themeColors.text }]}>
                  {type === 'folder' ? "Rename & Color" : "Rename"}
               </Text>
             </TouchableOpacity>

             <View style={styles.divider} />

             <TouchableOpacity style={styles.optionRow} onPress={onMove}>
               <Text style={[styles.optionText, { color: themeColors.text }]}>Move to Folder</Text>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', borderRadius: 20, padding: 20, elevation: 5 },
  modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  optionRow: { paddingVertical: 15, alignItems: 'center' },
  optionText: { fontSize: 16, fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(150,150,150,0.2)', width: '100%' },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  modalBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', backgroundColor: 'rgba(150,150,150,0.1)' },
  colorContainer: { marginBottom: 20 },
  colorLabel: { fontSize: 14, marginBottom: 10, fontWeight: '600' },
  colorRow: { flexDirection: 'row', justifyContent: 'space-between' },
  colorCircle: { width: 30, height: 30, borderRadius: 15 },
  colorSelected: { borderWidth: 3, borderColor: '#fff', shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
});