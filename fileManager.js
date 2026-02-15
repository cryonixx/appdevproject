import * as FileSystem from 'expo-file-system/legacy';

// The root folder for all your recordings
const RECORDINGS_DIR = FileSystem.documentDirectory + 'recordings/';

// 1. ENSURE DIRECTORY EXISTS
// Call this when the app starts to make sure your main folder exists
export const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(RECORDINGS_DIR);
  if (!dirInfo.exists) {
    console.log("Directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(RECORDINGS_DIR, { intermediates: true });
  }
};

// 2. CREATE A NEW FOLDER (e.g., "History Class", "Music Ideas")
export const createFolder = async (folderName) => {
  const newFolderUri = RECORDINGS_DIR + folderName + '/';
  try {
    await FileSystem.makeDirectoryAsync(newFolderUri, { intermediates: true });
    alert(`Folder "${folderName}" created!`);
  } catch (e) {
    console.error(e);
  }
};

// 3. MOVE A RECORDING TO A FOLDER
// When you finish recording, the file is usually in a temporary cache. 
// You must move it to your permanent folder.
export const saveRecording = async (tempUri, folderName, fileName) => {
  const destinationUri = RECORDINGS_DIR + folderName + '/' + fileName;
  
  try {
    await FileSystem.moveAsync({
      from: tempUri,
      to: destinationUri
    });
    console.log('File moved to:', destinationUri);
  } catch (e) {
    console.error('Error moving file:', e);
  }
};

// 4. LIST FILES IN A FOLDER (To display them in your UI)
export const getFiles = async (folderName = '') => {
  try {
    // If folderName is empty, it lists the root 'recordings/' folder
    const targetDir = RECORDINGS_DIR + folderName; 
    const files = await FileSystem.readDirectoryAsync(targetDir);
    return files; // Returns an array of strings: ['file1.m4a', 'SubFolder']
  } catch (e) {
    console.error(e);
    return [];
  }
}; 