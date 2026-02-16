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

// 1. 👇 Define Props Interface
interface PersistentSearchBarProps {
  currentFolderId?: string | null; // Optional: It can be a string (Folder ID) or null (Root)
}

// 2. 👇 Accept the prop in the function definition
export default function PersistentSearchBar({ currentFolderId = null }: PersistentSearchBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme] || Colors.light;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const { createFile } = useFileSystem(); 
  const { searchQuery, setSearchQuery } = useSearch();

  const [localText, setLocalText] = useState(searchQuery);

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
    setLocalText(text);     
    setSearchQuery(text);    
  };

  const handleClear = () => {
    setLocalText('');
    setSearchQuery('');
  };

  const handleImportAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*', 
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const { uri, name, size } = result.assets[0];

      if (size && size > 50 * 1024 * 1024) {
        Alert.alert("File too large", "Please select a file under 50MB.");
        return;
      }

      // 3. 👇 USE THE PROP HERE!
      // Instead of hardcoding 'null', we use 'currentFolderId'.
      // If we are on Home, it's null. If in a folder, it's that folder's ID.
      const newId = await createFile(name, currentFolderId, "Imported"); 

      const FS = FileSystem as any;
      const rootDir = FS.documentDirectory || FS.cacheDirectory;
      const recordingsFolder = rootDir + 'recordings/';
      const destinationUri = recordingsFolder + newId + '.m4a';

      const dirInfo = await FS.getInfoAsync(recordingsFolder);
      if (!dirInfo.exists) {
        await FS.makeDirectoryAsync(recordingsFolder, { intermediates: true });
      }

      await FileSystem.copyAsync({
        from: uri,
        to: destinationUri
      });

      setIsExpanded(false);
      console.log("Import success:", destinationUri);
      Alert.alert("Success", "Audio imported successfully!");

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
              value={localText} 
              onChangeText={handleTextChange}
              autoCorrect={false}
              autoCapitalize="none"
          />

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