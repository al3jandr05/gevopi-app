import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Dimensions, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../themes/colors';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/loginStyles';

const { height, width } = Dimensions.get('window');

export default function LoginScreen() {
  const titleAnimY = useRef(new Animated.Value(0)).current;
  const blueAnim = useRef(new Animated.Value(-height)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(1)).current;
  const screenFadeOut = useRef(new Animated.Value(1)).current;

  const titleColor = useRef(new Animated.Value(0)).current;
  const interpolatedColor = titleColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.darkBlue, colors.white],
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


  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardWillShow", (e) => {
      Animated.timing(formTranslateY, {
        toValue: -e.endCoordinates.height / 2,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardWillHide", () => {
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleLogin = () => {
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
  };



  return (
    <Animated.View style={[styles.container, { opacity: screenFadeOut }]}>

      <Animated.View style={{
        alignItems: 'center',
        position: 'absolute',
        top: height / 2 - 60,
        transform: [{ translateY: titleAnimY }],
        zIndex: 10,
        elevation: 10
      }}>
        <Animated.Text style={[styles.title, { color: interpolatedColor }]}>
          GEVOPI
        </Animated.Text>


        <Animated.View style={{ opacity: loadingOpacity, marginTop: 15 }}>
          <ActivityIndicator size="large" color={colors.darkBlue} />
        </Animated.View>
      </Animated.View>

      {/* Card Azul */}
      <Animated.View style={[styles.blueContainer, { transform: [{ translateY: blueAnim }] }]} />

      {/* Subtitulo */}
      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        Tu bienestar también importa
      </Animated.Text>

      {/* Formulario */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: '100%', alignItems: 'center' }}>
        <Animated.View style={[styles.card, { opacity: formOpacity, marginBottom: formTranslateY }]}>
          <Text style={styles.cardTitle}>Inicia Sesión</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={22} color={colors.darkBlue} style={styles.icon} />
            <TextInput placeholder="Ingrese su usuario" style={styles.input} placeholderTextColor={colors.gray} />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color={colors.darkBlue} style={styles.icon} />
            <TextInput placeholder="Ingrese su contraseña" secureTextEntry style={styles.input} placeholderTextColor={colors.gray} />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>ENTRAR</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
