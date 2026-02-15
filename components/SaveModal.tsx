import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';

interface SaveModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (fileName: string) => void;
}

export default function SaveModal({ isVisible, onClose, onSave }: SaveModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [fileName, setFileName] = useState("");

  const handleConfirm = () => {
    onSave(fileName);
    setFileName(""); // Clear input after use
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={[styles.modalBox, { backgroundColor: themeColors.container }]}>
            <Text style={[styles.title, { color: themeColors.text }]}>Name File:</Text>
            
            <TextInput
              style={[styles.input, { color: themeColors.text, borderBottomColor: themeColors.text }]}
              placeholder="Enter file name..."
              placeholderTextColor={themeColors.text + '80'} // 50% opacity
              value={fileName}
              onChangeText={setFileName}
              autoFocus={true}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
                <Text style={[styles.btnText, { color: themeColors.text }]}>Save</Text>
              </TouchableOpacity>
              
              <View style={[styles.divider, { backgroundColor: themeColors.text + '30' }]} />
              
              <TouchableOpacity style={styles.btn} onPress={onClose}>
                <Text style={[styles.btnText, { color: themeColors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Dims the background
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    borderRadius: 20,
    paddingTop: 20,
    overflow: 'hidden',
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    paddingVertical: 5,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  btn: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: '100%',
  },
});