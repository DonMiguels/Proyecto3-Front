// frontend/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const BASE_URL = 'http://192.168.0.101:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log(`Enviando solicitud a: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`Respuesta recibida de: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      Alert.alert(
        'Error de conexión',
        `No se pudo conectar al servidor en 192.168.0.101:5000.\n\n` +
        '1. Verifica que tu backend esté corriendo\n' +
        '2. Que tu teléfono y tu PC estén en la misma red Wi-Fi\n' +
        '3. Que tu firewall permita conexiones hacia el puerto 5000',
        [{ text: 'OK' }]
      );
    }
    return Promise.reject(error);
  }
);

export default api;
