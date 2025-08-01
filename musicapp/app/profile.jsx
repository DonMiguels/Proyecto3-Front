import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/api/profile');
      logout();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black p-4">
      <View className="items-center mb-8">
        <Image 
          source={{ uri: 'https://via.placeholder.com/150' }}
          className="w-32 h-32 rounded-full mb-4"
        />
        <Text className="text-white text-2xl font-bold">{user?.username}</Text>
        <Text className="text-gray-400">{user?.email}</Text>
      </View>
      
      <TouchableOpacity 
        className="bg-[#1e1e1e] p-4 rounded-lg mb-4"
        onPress={() => router.push('/edit-profile')}
      >
        <Text className="text-white">Editar perfil</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="bg-red-500 p-4 rounded-lg mb-4"
        onPress={handleDeleteAccount}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-bold">Eliminar Cuenta</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        className="bg-[#1e1e1e] p-4 rounded-lg"
        onPress={logout}
      >
        <Text className="text-white text-center font-bold">Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}