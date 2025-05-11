import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  Modal,
  Dimensions,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from '../styles/perfilStyles';
import colors from '../themes/colors';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';

import { getUsuarios } from '../services/usuarioService';
import { getVoluntarioByUsuarioId } from '../services/voluntarioService';
import { getLoggedEmail } from '../services/authService';
import { getVoluntarioByEmail } from '../services/voluntarioService';
import { crearSolicitudAyuda } from '../services/mutationsNOSQL';

const { width } = Dimensions.get('window');

const incendios = [
  { titulo: 'Incendio 1', fecha: '12/03/2025', lugar: 'Santa Cruz' },
  { titulo: 'Incendio 2', fecha: '10/02/2025', lugar: 'Santa Cruz' },
  { titulo: 'Incendio 3', fecha: '05/01/2025', lugar: 'Santa Cruz' },
];

const historialData = [
  {
    titulo: 'Historial Clínico',
    screen: 'HistorialScreen',
    items: [
      { titulo: 'Fractura de Brazo', descripcion: 'Lesión durante el fuego en Samaipata', fecha: '20/5/2025' },
      { titulo: 'Dolor en el Abdomen', descripcion: 'Síntoma después de estar 8 horas combatiendo el fuego', fecha: '19/5/2025' },
    ],
  },
  {
    titulo: 'Historial Psicológico',
    screen: 'HistorialScreen',
    items: [
      { titulo: 'Ansiedad', descripcion: 'Post incendio', fecha: '22/5/2025' },
      { titulo: 'Estrés agudo', descripcion: 'Durante rescate', fecha: '18/5/2025' },
    ],
  },
];

const necesidadesData = [
  {
    titulo: 'Necesidades',
    screen: 'NecesidadesCapacitacionesScreen',
    items: [
      { titulo: 'Primeros Auxilios', descripcion: 'Curso básico de RCP' },
      { titulo: 'Rescate en Incendios', descripcion: 'Técnicas de intervención' },
    ],
  },
  {
    titulo: 'Capacitaciones',
    screen: 'NecesidadesCapacitacionesScreen',
    items: [
      { titulo: 'Atención de víctimas', descripcion: 'Capacitación psicológica' },
      { titulo: 'Técnicas de Evacuación', descripcion: 'Formación avanzada' },
    ],
  },
];

export default function PerfilScreen() {
  const [infoVisible, setInfoVisible] = useState(false);
  const [voluntario, setVoluntario] = useState(null);
  const [loadingVoluntario, setLoadingVoluntario] = useState(true);
  const [historialIndex, setHistorialIndex] = useState(0);
  const [necesidadesIndex, setNecesidadesIndex] = useState(0);
  const [emergenciaVisible, setEmergenciaVisible] = useState(false);

  const navigation = useNavigation();
  const panelAnim = useRef(new Animated.Value(500)).current;
  const scrollXHistorial = useRef(new Animated.Value(0)).current;
  const scrollXNecesidades = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivel, setNivel] = useState('');

  const handleEnviarSolicitud = async () => {
    if (!tipo || !descripcion || !nivel) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      // 1. Permiso y ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso de ubicación denegado');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const latitud = location.coords.latitude;
      const longitud = location.coords.longitude;

      // 2. Fecha actual ISO
      const fecha = new Date().toISOString();

      // 3. Convertir nivel a ENUM
      const nivelNum = parseInt(nivel);
      const nivelEnum =
        nivelNum <= 2 ? 'BAJO' : nivelNum <= 3 ? 'MEDIO' : 'ALTO';

      // 4. Verificar ID
      if (!voluntario || !voluntario.id) {
        alert('No se pudo obtener ID del voluntario');
        return;
      }

      // 5. Enviar a backend usando función modular
      await crearSolicitudAyuda({
        tipo,
        descripcion,
        nivelEmergencia: nivelEnum,
        fecha,
        voluntarioId: voluntario.id.toString(),
        latitud,
        longitud,
      });

      // 6. Reset y feedback
      alert('Solicitud de ayuda enviada correctamente');
      setEmergenciaVisible(false);
      setTipo('');
      setDescripcion('');
      setNivel('');
    } catch (err) {
      console.error('Error al enviar solicitud:', err);
      alert('Error al enviar solicitud. Revisa consola.');
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, [])
  );

  useEffect(() => {
    const fetchVoluntario = async () => {
      try {
        const email = getLoggedEmail();
        console.log(email)
        const voluntarioData = await getVoluntarioByEmail(email);

        if (!voluntarioData) {
          console.warn('Voluntario no encontrado para:', email);
          setVoluntario(null);
          return;
        }

        setVoluntario(voluntarioData);
      } catch (error) {
        console.error('Error al cargar voluntario:', error);
      } finally {
        setLoadingVoluntario(false);
      }
    };

    fetchVoluntario();
  }, []);

  const openInfo = () => {
    setInfoVisible(true);
    Animated.timing(panelAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const closeInfo = () => {
    Animated.timing(panelAnim, { toValue: 500, duration: 300, useNativeDriver: true }).start(() =>
      setInfoVisible(false)
    );
  };

  const renderDots = (count, activeIndex) => (
    <View style={styles.dotsContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, { backgroundColor: i === activeIndex ? colors.darkBlue : colors.gray }]} />
      ))}
    </View>
  );

  const renderCarouselItem = ({ item }) => (
    <View style={{ width: width - 64 }}>
      <Text style={styles.carouselSectionTitle}>{item.titulo}</Text>
      {item.items.map((subItem, idx) => (
        <TouchableOpacity key={idx} style={styles.widgetCard} onPress={() => navigation.navigate(item.screen)}>
          <Text style={styles.itemTitle}>{subItem.titulo}</Text>
          <Text style={styles.itemSubtitle}>{subItem.descripcion}</Text>
          {subItem.fecha && <Text style={styles.itemSubtitle}>Fecha: {subItem.fecha}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loadingVoluntario) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.darkBlue} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!voluntario) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Voluntario no encontrado.</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.lighterCyan, opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 10 }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40, // puedes ajustar según necesites
              right: 20,
              backgroundColor: 'red',
              padding: 10,
              borderRadius: 25,
              zIndex: 20,
              elevation: 5,
            }}
            onPress={() => setEmergenciaVisible(true)}
          >
            <FontAwesome5 name="bullhorn" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {/* Perfil */}
        <View style={styles.perfilContainer}>
          <View style={styles.avatarWrapper}>
            {voluntario.fotoPerfil ? (
              <Image source={{ uri: voluntario.fotoPerfil }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {voluntario.nombre?.charAt(0).toUpperCase() ?? '-'}
                </Text>
              </View>
            )}
            <View style={[styles.statusDot, { backgroundColor: 'green' }]} />
          </View>

          <Text style={styles.name}>{voluntario.nombre} {voluntario.apellido}</Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.circleButton} onPress={openInfo}>
              <FontAwesome5 name="info" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate("Evaluaciones")}>
              <FontAwesome5 name="clipboard-list" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate("Solicitudes")}>
              <FontAwesome5 name="list-alt" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Incendios */}
        <TouchableOpacity style={styles.sectionCard} activeOpacity={0.9} onPress={() => navigation.navigate('IncendiosMitigados')}>
          <Text style={styles.sectionTitle}>Últimos Incendios</Text>
          {incendios.map((inc, i) => (
            <View key={i} style={styles.widgetCard}>
              <Text style={styles.itemTitle}>{inc.titulo}</Text>
              <Text style={styles.itemSubtitle}>Fecha: {inc.fecha}</Text>
              <Text style={styles.itemSubtitle}>Lugar: {inc.lugar}</Text>
            </View>
          ))}
        </TouchableOpacity>

        {/* Historial */}
        <TouchableOpacity style={styles.sectionCard} activeOpacity={0.9} onPress={() => navigation.navigate('Historial')}>
          <Animated.FlatList
            data={historialData}
            renderItem={renderCarouselItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollXHistorial } } }], { useNativeDriver: false })}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / (width - 64));
              setHistorialIndex(newIndex);
            }}
            scrollEventThrottle={16}
          />
          {renderDots(historialData.length, historialIndex)}
        </TouchableOpacity>

        {/* Necesidades y Capacitaciones */}
        <TouchableOpacity style={styles.sectionCard} activeOpacity={0.9} onPress={() => navigation.navigate('NecesidadesCapacitaciones')}>
          <Animated.FlatList
            data={necesidadesData}
            renderItem={renderCarouselItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollXNecesidades } } }], { useNativeDriver: false })}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / (width - 64));
              setNecesidadesIndex(newIndex);
            }}
            scrollEventThrottle={16}
          />
          {renderDots(necesidadesData.length, necesidadesIndex)}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Información Voluntario */}
      <Modal transparent visible={infoVisible} animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={closeInfo} />
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: panelAnim }] }]}>
          <TouchableOpacity style={styles.closeButton} onPress={closeInfo}>
            <FontAwesome5 name="times" size={20} color={colors.darkBlue} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Información del Voluntario</Text>

          <View style={styles.infoRow}>
            <FontAwesome5 name="user" size={20} color={colors.darkBlue} />
            <Text style={styles.infoText}>{voluntario.nombre} {voluntario.apellido}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="id-card" size={20} color={colors.darkBlue} />
            <Text style={styles.infoText}>{voluntario.ci}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="phone" size={20} color={colors.darkBlue} />
            <Text style={styles.infoText}>{voluntario.telefono}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="tint" size={20} color={colors.darkBlue} />
            <Text style={styles.infoText}>{voluntario.tipo_sangre}</Text>
          </View>
        </Animated.View>
      </Modal>

      <Modal transparent visible={emergenciaVisible} animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setEmergenciaVisible(false)} />
        <View style={[styles.modalContent]}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setEmergenciaVisible(false)}>
            <FontAwesome5 name="times" size={20} color={colors.darkBlue} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Reportar Emergencia</Text>

          <View style={styles.infoRow}>
            <Text>Tipo de emergencia:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.gray,
                borderRadius: 8,
                marginTop: 5,
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <Picker
                selectedValue={tipo}
                onValueChange={(itemValue) => setTipo(itemValue)}
                style={{ width: '100%' }}
              >
                <Picker.Item label="Selecciona un tipo" value="" />
                <Picker.Item label="Físico" value="Fisico" />
                <Picker.Item label="Emocional" value="Emocional" />
                <Picker.Item label="Recurso" value="Recurso" />
              </Picker>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text>Descripción:</Text>
            <TextInput
              placeholder="Descripción breve"
              style={styles.input}
              value={descripcion}
              onChangeText={setDescripcion}
            />
          </View>

          <View style={styles.infoRow}>
            <Text>Nivel de emergencia:</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.gray,
                borderRadius: 8,
                marginTop: 5,
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <Picker
                selectedValue={nivel}
                onValueChange={(itemValue) => setNivel(itemValue)}
                style={{ width: '100%' }}
              >
                <Picker.Item label="Selecciona un nivel" value="" />
                <Picker.Item label="Bajo" value="1" />
                <Picker.Item label="Medio" value="3" />
                <Picker.Item label="Alto" value="5" />
              </Picker>
            </View>
          </View>

          {/* Botón ENVIAR */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.darkBlue,
              padding: 12,
              marginTop: 20,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={handleEnviarSolicitud}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>ENVIAR</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Animated.View>
  );
}
