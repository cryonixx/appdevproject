import { Colors } from "@/constants/theme";
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useSearch } from '@/contexts/SearchContext';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  useColorScheme,
  View
} from 'react-native';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PersistentSearchBar() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme] || Colors.light;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const { createFile } = useFileSystem(); 
  const { searchQuery, setSearchQuery } = useSearch();

  // 1. 👇 LOCAL STATE: This is what keeps the text from deleting!
  const [localText, setLocalText] = useState(searchQuery);

  // 2. 👇 SYNC: If the global search is cleared (from elsewhere), update local
  useEffect(() => {
    setLocalText(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardOffset(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const toggleMenu = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleTextChange = (text: string) => {
    setLocalText(text);      // Fast UI update (text won't disappear)
    setSearchQuery(text);    // Slow background update (filtering)
  };

  const handleClear = () => {
    setLocalText('');
    setSearchQuery('');
  };

  // ... (keep handleImportAudio logic exactly as you had it) ...
  const handleImportAudio = async () => { try {
      // A. Open System File Picker
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*', // Only allow audio files
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const { uri, name, size } = result.assets[0];

      // Optional: Check file size (limit to 50MB for example)
      if (size && size > 50 * 1024 * 1024) {
        Alert.alert("File too large", "Please select a file under 50MB.");
        return;
      }

      // B. Create Entry in Context (Metadata)
      // We pass 'null' as parentId to put it in the root folder
      // We pass the file name as the title
      const newId = await createFile(name, null, "Imported"); 

      // C. Determine Paths
      const FS = FileSystem as any;
      const rootDir = FS.documentDirectory || FS.cacheDirectory;
      const destinationUri = rootDir + 'recordings/' + newId;

      // D. Copy the file from external storage to our sandbox
      await FileSystem.copyAsync({
        from: uri,
        to: destinationUri
      });

      // E. Close menu and notify user
      setIsExpanded(false);
      // Optional: Navigate to home or show success toast
      console.log("Import success:", destinationUri);

    } catch (error) {
      console.error("Import failed:", error);
      Alert.alert("Import Failed", "Could not copy the audio file.");
    }
  };

  return (
    <View style={[
      styles.bottomBar, 
      { 
        backgroundColor: themeColors.tabIconDefault, 
        borderTopColor: themeColors.bordercolorSelected,
        marginBottom: keyboardOffset, 
      }
    ]}>
      
      <View style={styles.topRow}>
        <View style={[styles.searchContainer, { backgroundColor: themeColors.container }]}>
          <Ionicons name="search" size={20} color={themeColors.text} style={{ marginRight: 10 }} />
          
          <TextInput 
              placeholder="Search"
              placeholderTextColor={themeColors.lightext}
              style={{ flex: 1, fontSize: 16, color: themeColors.text, textAlign: 'center' }}
              
              // 3. 👇 USE LOCAL TEXT
              value={localText} 
              onChangeText={handleTextChange}
              
              // 4. 👇 PREVENT GLITCHES
              autoCorrect={false}
              autoCapitalize="none"
          />

          {/* 5. 👇 THE CLEAR BUTTON: It will show up now! */}
          {localText.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={{ padding: 5 }}>
              <Ionicons name="close-circle" size={22} color={themeColors.text} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: themeColors.container }]}
          onPress={toggleMenu}
        >
          <Ionicons 
            name={isExpanded ? "close" : "add"} 
            size={30} 
            color={themeColors.text} 
          />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View style={styles.unifiedButtonGroup}>
          {/* ... (Keep your action buttons exactly the same) ... */}
          <TouchableOpacity 
            style={[styles.actionButton, styles.topButton, { backgroundColor: themeColors.container }]}
            onPress={() => router.push('/recording_codes/record')}
          >
            <Ionicons name="mic-outline" size={20} color={themeColors.text} />
            <Text style={[styles.actionText, { color: themeColors.text }]}>New Recording</Text>
          </TouchableOpacity>

          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 15 }} />

          <TouchableOpacity 
            style={[styles.actionButton, styles.bottomButton, { backgroundColor: themeColors.container }]}
            onPress={handleImportAudio}
          >
            <Ionicons name="document-attach-outline" size={20} color={themeColors.text} />
            <Text style={[styles.actionText, { color: themeColors.text }]}>Import Audio File</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ... styles remain the same

const styles = StyleSheet.create({
  bottomBar: {
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    borderTopWidth: 3,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unifiedButtonGroup: {
    marginTop: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionButton: {
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 15,
  },
  
  topButton: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomButton: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  }
});