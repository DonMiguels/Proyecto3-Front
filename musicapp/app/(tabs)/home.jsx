import { useEffect, useState, useRef } from 'react'; // Added useRef import
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import SongCard from '../../components/SongCard';
import { usePlayer } from '../../context/PlayerContext';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();
  const { user } = useAuth();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const songsRes = await api.get('/api/songs');
        setSongs(songsRes.data);
        
        if (user) {
          const playlistsRes = await api.get('/api/playlists');
          setFeaturedPlaylists(playlistsRes.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        // Start animations after data loads
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
          })
        ]).start();
      }
    };
    
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <LinearGradient 
        colors={['#121212', '#1a1a2e', '#16213e']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient 
      colors={['#121212', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.contentContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <Text style={styles.sectionTitle}>Canciones Populares</Text>
        <FlatList
          data={songs}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <SongCard 
              song={item} 
              onPress={() => playSong(item, songs)}
            />
          )}
          contentContainerStyle={styles.songList}
        />
        
        {featuredPlaylists.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Playlists Destacadas</Text>
            <FlatList
              horizontal
              data={featuredPlaylists}
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.playlistCard}>
                  <Image 
                    source={{ uri: item.cover_image || 'https://via.placeholder.com/150' }} 
                    style={styles.playlistImage}
                  />
                  <Text style={styles.playlistTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              )}
              contentContainerStyle={styles.playlistContainer}
            />
          </>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  songList: {
    paddingBottom: 20,
  },
  playlistContainer: {
    paddingBottom: 30,
  },
  playlistCard: {
    width: 160,
    marginRight: 20,
  },
  playlistImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#252525',
  },
  playlistTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    paddingHorizontal: 4,
  },
});