import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api from '../api';
import SongCard from '../components/SongCard';
import { usePlayer } from '../context/PlayerContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function PlaylistDetail() {
  const { id } = useLocalSearchParams();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const { playSong } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await api.get(`/api/playlists/${id}`);
        setPlaylist(response.data);
        setSongs(response.data.songs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlaylist();
  }, [id]);

  if (!playlist) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">Cargando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="p-4">
        <View className="flex-row items-center">
          <Ionicons name="chevron-back" size={24} color="white" />
          <Text className="text-white text-2xl font-bold ml-4">{playlist.name}</Text>
        </View>
        <Text className="text-gray-400 mt-2">{songs.length} canciones</Text>
      </View>
      
      {songs.length > 0 ? (
        <FlatList
          data={songs}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <SongCard 
              song={item} 
              onPress={() => playSong(item, songs)}
              showLikeButton={user?.id !== item.artist_id}
            />
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-400">No hay canciones en esta playlist</Text>
        </View>
      )}
    </View>
  );
}