// frontend/app/(auth)/register.jsx
import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Animated, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const { register, networkError } = useAuth();
  const router = useRouter();
  
  // Referencias para manejar el foco
  const emailRef = useRef();
  const passwordRef = useRef();
  
  // Animaciones usando useRef
  const logoScale = useRef(new Animated.Value(1)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    // Animación de entrada
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1.1,
        friction: 3,
        useNativeDriver: true,
        delay: 100
      }),
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true
        }),
        Animated.timing(formTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    setLoading(true);
    try {
      await register(username, email, password, role);
    } catch (error) {
      Alert.alert('Error', error);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar el foco entre campos
  const handleUsernameSubmit = () => {
    emailRef.current.focus();
  };

  const handleEmailSubmit = () => {
    passwordRef.current.focus();
  };

  return (
    <LinearGradient 
      colors={['#121212', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo animado */}
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
            <Ionicons name="person-add" size={80} color="#1DB954" />
            <Text style={styles.appTitle}>Crear Cuenta</Text>
            <Text style={styles.appSubtitle}>Únete a nuestra comunidad musical</Text>
          </Animated.View>
          
          {/* Mensaje de error de red */}
          {networkError && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={24} color="#ff5555" />
              <Text style={styles.errorText}>
                Error de conexión. Verifica tu red.
              </Text>
            </View>
          )}
          
          {/* Formulario animado */}
          <Animated.View style={[
            styles.formContainer, 
            { 
              opacity: formOpacity,
              transform: [{ translateY: formTranslateY }] 
            }
          ]}>
            {/* Campo de nombre de usuario */}
            <View style={[
              styles.inputContainer,
              focusedInput === 'username' && styles.inputFocused
            ]}>
              <Ionicons 
                name="person" 
                size={20} 
                color={focusedInput === 'username' ? '#1DB954' : '#9ca3af'} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={setUsername}
                returnKeyType="next"
                onSubmitEditing={handleUsernameSubmit}
                onFocus={() => setFocusedInput('username')}
                onBlur={() => setFocusedInput(null)}
                autoCapitalize="none"
              />
            </View>
            
            {/* Campo de email */}
            <View style={[
              styles.inputContainer,
              focusedInput === 'email' && styles.inputFocused
            ]}>
              <Ionicons 
                name="mail" 
                size={20} 
                color={focusedInput === 'email' ? '#1DB954' : '#9ca3af'} 
                style={styles.inputIcon}
              />
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={handleEmailSubmit}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            
            {/* Campo de contraseña */}
            <View style={[
              styles.inputContainer,
              focusedInput === 'password' && styles.inputFocused
            ]}>
              <Ionicons 
                name="lock-closed" 
                size={20} 
                color={focusedInput === 'password' ? '#1DB954' : '#9ca3af'} 
                style={styles.inputIcon}
              />
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            
            {/* Selector de rol */}
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Tipo de cuenta:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'user' && styles.roleButtonSelected
                  ]}
                  onPress={() => setRole('user')}
                >
                  <Text style={[
                    styles.roleButtonText,
                    role === 'user' && styles.roleButtonTextSelected
                  ]}>
                    Usuario
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'author' && styles.roleButtonSelected
                  ]}
                  onPress={() => setRole('author')}
                >
                  <Text style={[
                    styles.roleButtonText,
                    role === 'author' && styles.roleButtonTextSelected
                  ]}>
                    Artista
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Botón de registro */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.registerButtonText}>Crear Cuenta</Text>
              )}
            </TouchableOpacity>
            
            {/* Enlace a login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta? 
              </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>
                  Inicia sesión
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Ola decorativa en la parte inferior */}
      <View style={styles.waveContainer}>
        <View style={styles.wave} />
        <View style={[styles.wave, styles.wave2]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    letterSpacing: 1,
  },
  appSubtitle: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a0a0a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff5555',
    marginLeft: 10,
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2d2d2d',
  },
  inputFocused: {
    borderColor: '#1DB954',
    backgroundColor: '#252525',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 55,
    color: 'white',
    fontSize: 16,
  },
  roleContainer: {
    marginVertical: 15,
  },
  roleLabel: {
    color: '#9ca3af',
    marginBottom: 10,
    fontSize: 16,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d2d2d',
  },
  roleButtonSelected: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
  },
  roleButtonText: {
    color: '#9ca3af',
    fontWeight: '600',
  },
  roleButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginText: {
    color: '#9ca3af',
  },
  loginLink: {
    color: '#1DB954',
    fontWeight: '600',
    marginLeft: 5,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#1DB954',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    opacity: 0.1,
  },
  wave2: {
    height: 80,
    opacity: 0.05,
    transform: [{ scaleX: 1.2 }],
  },
});