/*
import { useAudioPlayer } from 'expo-audio';
import { Button, Text, View } from 'react-native';

export default function App() {
  // 1. Load the player (no ref needed!)
  const player = useAudioPlayer(require('../../assets/my-track.mp3'));

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Status: {player.playing ? "Playing" : "Paused"}</Text>
      
      <Button 
        title={player.playing ? "Pause" : "Play"} 
        onPress={() => {
          if (player.playing) {
            // This is the React Native version of .pause()
            player.pause(); 
          } else {
            player.play();
          }
        }} 
      />
    </View>
  );
}
  */