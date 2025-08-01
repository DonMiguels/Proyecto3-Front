import { View, Text, Slider, Image } from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import PlayerControls from '../components/PlayerControls';
import { Ionicons } from '@expo/vector-icons';

export default function Player() {
  const { 
    currentSong, 
    isPlaying, 
    playbackPosition, 
    playbackDuration,
    togglePlayPause,
    playNext,
    playPrevious,
    seek
  } = usePlayer();

  if (!currentSong) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">Selecciona una canción</Text>
      </View>
    );
  }

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View className="flex-1 bg-black p-8">
      <View className="items-center mb-8">
        <Ionicons name="chevron-down" size={30} color="white" />
      </View>
      
      <Image 
        source={{ uri: currentSong.cover_image || 'https://via.placeholder.com/300' }} 
        className="w-64 h-64 rounded-lg self-center mb-8"
      />
      <View className="mb-4">
        <Text className="text-white text-2xl font-bold text-center">
          {currentSong.title}
        </Text>
        <Text className="text-gray-400 text-center">
          {currentSong.artist?.username || 'Desconocido'}
        </Text>
      </View>
      
      <Slider
        minimumValue={0}
        maximumValue={playbackDuration || 1}
        value={playbackPosition || 0}
        onSlidingComplete={seek}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#535353"
        thumbTintColor="#1DB954"
      />
      
      <View className="flex-row justify-between mb-8">
        <Text className="text-gray-400">
          {formatTime(playbackPosition || 0)}
        </Text>
        <Text className="text-gray-400">
          {formatTime(playbackDuration || 0)}
        </Text>
      </View>
      
      <PlayerControls 
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onNext={playNext}
        onPrevious={playPrevious}
      />
    </View>
  );
}