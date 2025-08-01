import { useState } from 'react'; // Importar useState
import { View, Text, TextInput, FlatList } from 'react-native';
import SongCard from '../../components/SongCard';
import { usePlayer } from '../../context/PlayerContext';
import api from '../../api';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { playSong } = usePlayer();

  const searchSongs = async (text) => {
    setQuery(text);
    if (text.length > 2) {
      try {
        const response = await api.get(`/api/songs/search?query=${text}`);
        setResults(response.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <View className="flex-1 bg-black p-4">
      <TextInput
        className="w-full h-12 bg-[#1e1e1e] text-white rounded-full px-4 mb-4"
        placeholder="Buscar canciones..."
        placeholderTextColor="#9ca3af"
        value={query}
        onChangeText={searchSongs}
      />
      <FlatList
        data={results}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <SongCard 
            song={item} 
            onPress={() => playSong(item, results)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}