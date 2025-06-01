import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../themes/colors';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/loginStyles';
import { login, getLoggedCi } from '../services/authService';

const { height, width } = Dimensions.get('window');

export default function LoginScreen() {
  const titleAnimY = useRef(new Animated.Value(0)).current;
  const blueAnim = useRef(new Animated.Value(-height)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current; 
  const loadingOpacity = useRef(new Animated.Value(1)).current;
  const screenFadeOut = useRef(new Animated.Value(1)).current;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const titleColor = useRef(new Animated.Value(0)).current;
  const interpolatedColor = titleColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.verdeOscuro, colors.white],
  });

  const navigation = useNavigation();

  useEffect(() => {
    Animated.sequence([
      Animated.delay(2000),
      Animated.timing(loadingOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.parallel([
        Animated.timing(blueAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(titleAnimY, {
          toValue: -height * 0.2,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(titleColor, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, []);

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!username.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tanto el usuario como la contraseña');
      return;
    }

    try {
      const token = await login(username, password);
      console.log("TOKEN:", token);

      const emailGuardado = getLoggedCi ();
      console.log("CI GUARDADO:", emailGuardado);

      // Animaciones y navegación
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(formOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(titleAnimY, {
          toValue: -height,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(titleColor, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(blueAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(screenFadeOut, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start(() => {
        navigation.navigate('Perfil');
      });

    } catch (error) {
      let errorMessage = 'Error de autenticación';
      if (error.message.includes('El CI debe ser un número')) {
        errorMessage = 'El CI debe contener solo números';
      }
      Alert.alert('Error', errorMessage);
      console.error("Error completo:", error);
    }
  };


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.container, { opacity: screenFadeOut }]}>
          <Animated.View
            style={{
              alignItems: 'center',
              position: 'absolute',
              top: height / 2 - 80,
              transform: [{ translateY: titleAnimY }],
              zIndex: 10,
              elevation: 10,
            }}
          >
            <Animated.Text style={[styles.title, { color: interpolatedColor }]}>
              GEVOPI
            </Animated.Text>

            <Animated.View style={{ opacity: loadingOpacity, marginTop: 15 }}>
              <ActivityIndicator size="large" color={colors.verdeOscuro} />
            </Animated.View>
          </Animated.View>

          {/* Fondo azul animado */}
          <Animated.View style={[styles.blueContainer, { transform: [{ translateY: blueAnim }] }]} />

          {/* Subtítulo */}
          <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
            Tu bienestar también importa
          </Animated.Text>

          {/* Formulario */}
          <Animated.View style={[styles.card, { opacity: formOpacity }]}>
            <Text style={styles.cardTitle}>Inicia Sesión</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={22} color={colors.verdeOscuro} style={styles.icon} />
              <TextInput
                placeholder="Ingrese su usuario"
                style={styles.input}
                placeholderTextColor={colors.gray}
                value={username}
                onChangeText={setUsername}
                keyboardType="numeric" 
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color={colors.verdeOscuro} style={styles.icon} />
              <TextInput
                placeholder="Ingrese su contraseña"
                secureTextEntry={!showPassword}
                style={[styles.input, { paddingRight: 40 }]}
                placeholderTextColor={colors.gray}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={toggleShowPassword}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={colors.gray}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>ENTRAR</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
  );
}
