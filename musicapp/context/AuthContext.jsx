// frontend/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '../api';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/api/profile');
          setUser(response.data);
          setNetworkError(false);
        } catch (error) {
          console.error('Error loading user:', error);
          if (error.message === "Network Error") {
            setNetworkError(true);
          }
          await AsyncStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/login', { email, password });
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      setUser(user);
      setNetworkError(false);
      router.replace('/(tabs)/home');
      return user;
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Error al iniciar sesión';
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.message === "Network Error") {
        errorMessage = 'Error de red: Verifica tu conexión';
        setNetworkError(true);
      }
      
      throw errorMessage;
    }
  };

  const register = async (username, email, password, role) => {
    try {
      const response = await api.post('/api/register', { username, email, password, role });
      setNetworkError(false);
      
      Alert.alert(
        'Registro exitoso', 
        'Por favor inicia sesión con tus nuevas credenciales.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (error) {
      console.error('Register error:', error);
      
      let errorMessage = 'Error al registrar';
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.message === "Network Error") {
        errorMessage = 'Error de red: Verifica tu conexión';
        setNetworkError(true);
      }
      
      throw errorMessage;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      networkError,
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);