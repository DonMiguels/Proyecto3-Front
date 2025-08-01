import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

export default function PlaylistCard({ playlist }) {
  return (
    <TouchableOpacity 
      className="flex-row items-center p-3 bg-[#1e1e1e] rounded-lg mb-2"
      onPress={() => router.push(`/playlist-detail?id=${playlist.id}`)}
    >
      <Image 
        source={{ uri: playlist.cover_image || 'https://via.placeholder.com/50' }} 
        className="w-12 h-12 rounded-md"
      />
      <View className="ml-3">
        <Text className="text-white font-medium">{playlist.name}</Text>
        <Text className="text-gray-400 text-sm">{playlist.song_count || 0} canciones</Text>
      </View>
    </TouchableOpacity>
  );
}