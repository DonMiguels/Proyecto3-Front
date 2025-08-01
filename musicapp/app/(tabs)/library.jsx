import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import PlaylistCard from '../../components/PlaylistCard';

export default function Library() {
  const [playlists, setPlaylists] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchPlaylists = async () => {
        try {
          const response = await api.get('/api/playlists');
          setPlaylists(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchPlaylists();
    }
  }, [user]);

  return (
    <View className="flex-1 bg-black p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-2xl font-bold">Tus Playlists</Text>
        <TouchableOpacity 
          className="bg-[#1DB954] px-4 py-2 rounded-full"
          onPress={() => router.push('/create-playlist')}
        >
          <Text className="text-white">Crear</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={playlists}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <PlaylistCard playlist={item} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}