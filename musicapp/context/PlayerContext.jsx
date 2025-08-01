// frontend/context/PlayerContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { Audio } from 'expo-av';
import api from '../api'; // Importamos la instancia de api para obtener la URL base
import { Alert } from 'react-native';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(null);
  const [playbackDuration, setPlaybackDuration] = useState(null);
  const [playlist, setPlaylist] = useState([]);

  const playSong = async (song, playlist = []) => {
    if (sound) {
      await sound.unloadAsync();
    }
    
    if (playlist.length > 0) {
      setPlaylist(playlist);
    }

    try {
      // Usamos la misma URL base que en api.js
      const fileUrl = `${api.defaults.baseURL}${song.file_path}`;
      console.log('Reproduciendo canción desde:', fileUrl);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: fileUrl },
        { shouldPlay: true }
      );
      
      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) {
          setPlaybackPosition(status.positionMillis);
          setPlaybackDuration(status.durationMillis);
          if (status.didJustFinish) {
            playNext();
          }
        }
      });

      setSound(newSound);
      setCurrentSong(song);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error al reproducir canción:', error);
      Alert.alert('Error', 'No se pudo cargar la canción. Intenta de nuevo más tarde.');
    }
  };

  const playNext = async () => {
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextSong = playlist[nextIndex];
    if (nextSong) {
      await playSong(nextSong, playlist);
    }
  };

  const playPrevious = async () => {
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevSong = playlist[prevIndex];
    if (prevSong) {
      await playSong(prevSong, playlist);
    }
  };

  const togglePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seek = async (position) => {
    if (sound) {
      await sound.setPositionAsync(position);
    }
  };

  return (
    <PlayerContext.Provider value={{
      currentSong,
      sound,
      isPlaying,
      playbackPosition,
      playbackDuration,
      playlist,
      playSong,
      playNext,
      playPrevious,
      togglePlayPause,
      seek
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);