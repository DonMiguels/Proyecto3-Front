import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlayerControls({ isPlaying, onPlayPause, onNext, onPrevious }) {
  return (
    <View className="flex-row justify-center items-center">
      <TouchableOpacity onPress={onPrevious} className="mx-4">
        <Ionicons name="play-skip-back" size={32} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onPlayPause} 
        className="bg-[#1DB954] rounded-full p-4 mx-4"
      >
        <Ionicons 
          name={isPlaying ? "pause" : "play"} 
          size={32} 
          color="black" 
        />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onNext} className="mx-4">
        <Ionicons name="play-skip-forward" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}