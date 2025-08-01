import { Stack, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { PlayerProvider } from '../context/PlayerContext';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import { useEffect } from 'react';

// Componente wrapper para manejar la redirección
function AuthWrapper({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return children;
}

export default function Layout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <PlayerProvider>
          <StatusBar style="light" />
          <AuthWrapper>
            <Stack screenOptions={{ headerShown: false }} />
          </AuthWrapper>
        </PlayerProvider>
      </AuthProvider>
    </PaperProvider>
  );
}