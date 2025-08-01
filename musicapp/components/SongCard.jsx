import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function SongCard({ song, onPress, showLikeButton = true }) {
  const { currentSong } = usePlayer();
  const { user } = useAuth();
  const isCurrent = currentSong?.id === song.id;

  const handleLike = async () => {
    try {
      await api.post(`/like/${song.id}`);
      // Actualizar UI según sea necesario
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity 
      className={`flex-row items-center p-3 ${isCurrent ? 'bg-[#1DB954]/20' : 'bg-[#1e1e1e]'} rounded-lg mb-2`}
      onPress={onPress}
    >
      <Image 
        source={{ uri: song.cover_image || 'https://via.placeholder.com/50' }} 
        className="w-12 h-12 rounded-md"
      />
      <View className="ml-3 flex-1">
        <Text className={`${isCurrent ? 'text-[#1DB954]' : 'text-white'} font-medium`}>{song.title}</Text>
        <Text className="text-gray-400 text-sm">{song.artist?.username || 'Desconocido'}</Text>
      </View>
      
      {showLikeButton && user && (
        <TouchableOpacity onPress={handleLike} className="p-2">
          <Ionicons name="heart-outline" size={20} color="white" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}