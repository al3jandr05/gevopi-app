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
  KeyboardAvoidingView, Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from '../styles/perfilStyles';
import colors from '../themes/colors';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';

import { Dropdown } from 'react-native-element-dropdown';

import { getUsuarios } from '../services/usuarioService';
import { getVoluntarioByUsuarioId } from '../services/voluntarioService';
import { getLoggedCi } from '../services/authService';
import { getVoluntarioByCi } from '../services/voluntarioService';
import { crearSolicitudAyuda, crearHistorialUbicacion } from '../services/mutationsNOSQL';
import { obtenerReportePorVoluntarioId, obtenerDatosCarrusel } from '../services/queriesSQL';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default function PerfilScreen() {
  const [infoVisible, setInfoVisible] = useState(false);
  const [voluntario, setVoluntario] = useState(null);
  const [loadingVoluntario, setLoadingVoluntario] = useState(true);
  const [historialIndex, setHistorialIndex] = useState(0);
  const [necesidadesIndex, setNecesidadesIndex] = useState(0);
  const [emergenciaVisible, setEmergenciaVisible] = useState(false);

  const dotAnimsHistorial = useRef([]);
  const dotAnimsNecesidades = useRef([]);

  const navigation = useNavigation();
  const panelAnim = useRef(new Animated.Value(500)).current;
  const scrollXHistorial = useRef(new Animated.Value(0)).current;
  const scrollXNecesidades = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const blueAnim = useRef(new Animated.Value(-height)).current;

  const dotAnims = useRef([]).current;

  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivel, setNivel] = useState('');

  const [carruselData, setCarruselData] = useState({
    necesidades: [],
    capacitaciones: [],
    resumenFisico: null,
    resumenEmocional: null,
    tieneDatos: false,
    fecha: null,
    esReporteAnterior: false
  });

  const getHistorialData = () => {
    if (!carruselData) return [];
    
    const formatFecha = (fechaString) => {
      if (!fechaString) return 'Fecha no disponible';
      try {
        const fecha = new Date(fechaString);
        return isNaN(fecha.getTime()) ? 'Fecha no disponible' : fecha.toLocaleDateString('es-ES');
      } catch (e) {
        return 'Fecha no disponible';
      }
    };

    return [
      {
        titulo: 'Historial Clínico',
        screen: 'Historial',
        items: carruselData.resumenFisico 
          ? [{ 
              titulo: 'Resumen Físico', 
              descripcion: carruselData.resumenFisico, 
              fecha: formatFecha(carruselData.fecha)
            }]
          : [],
      },
      {
        titulo: 'Historial Psicológico',
        screen: 'Historial',
        items: carruselData.resumenEmocional
          ? [{ 
              titulo: 'Resumen Emocional', 
              descripcion: carruselData.resumenEmocional, 
              fecha: formatFecha(carruselData.fecha)
            }]
          : [],
      },
    ];
  };

  const getNecesidadesData = () => {
    if (!carruselData) return [];
    
    const necesidades = carruselData.necesidades?.length > 0 
      ? carruselData.necesidades.map(n => ({
          ...n,
          esPlaceholder: false
        }))
      : [{
          titulo: "Formulario Pendiente",
          descripcion: "Por favor complete el formulario enviado a su correo",
          esPlaceholder: true
        }];

    const capacitaciones = carruselData.capacitaciones?.length > 0
      ? carruselData.capacitaciones.map(c => ({
          ...c,
          esPlaceholder: false
        }))
      : [{
          titulo: "Formulario Pendiente", 
          descripcion: "Por favor complete el formulario enviado a su correo",
          esPlaceholder: true
        }];

    return [
      {
        titulo: 'Necesidades',
        screen: 'NecesidadesCapacitaciones',
        items: necesidades
      },
      {
        titulo: 'Capacitaciones',
        screen: 'NecesidadesCapacitaciones',
        items: capacitaciones
      }
    ];
  };


  const handleEnviarSolicitud = async () => {
    if (!tipo || !descripcion || !nivel) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso de ubicación denegado');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const latitud = location.coords.latitude;
      const longitud = location.coords.longitude;

      const fecha = new Date().toISOString();

      const nivelNum = parseInt(nivel);
      const nivelEnum =
        nivelNum <= 2 ? 'BAJO' : nivelNum <= 3 ? 'MEDIO' : 'ALTO';

      if (!voluntario || !voluntario.id) {
        alert('No se pudo obtener ID del voluntario');
        return;
      }

      await crearSolicitudAyuda({
        tipo,
        descripcion,
        nivelEmergencia: nivelEnum,
        fecha,
        voluntarioId: voluntario.id.toString(),
        latitud,
        longitud,
      });

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
        useNativeDriver: true,
      }).start();
    }, [])
  );

  useEffect(() => {
    const fetchVoluntario = async () => {
      try {
        setLoadingVoluntario(true);
        const ci = getLoggedCi();
        console.log("Buscando voluntario con CI:", ci); // Agrega log para debug

        const voluntarioData = await getVoluntarioByCi(ci);
        console.log("Datos recibidos:", voluntarioData);

        if (!voluntarioData || !voluntarioData.id) {
          console.log("No se encontró voluntario válido");
          setVoluntario(null);
          return;
        }

        setVoluntario(voluntarioData);
        const reportes = await obtenerReportePorVoluntarioId(voluntarioData.id.toString());

        if (reportes?.length > 0) {
          // Ordenar reportes por fecha (más reciente primero)
          const reportesOrdenados = [...reportes].sort(
            (a, b) => new Date(b.fechaGenerado) - new Date(a.fechaGenerado)
          );
          
          // Buscar el PRIMER reporte que tenga necesidades o capacitaciones (igual que NecesidadesCapacitaciones)
          const reporteConDatos = reportesOrdenados.find(r => 
            (r.necesidades && r.necesidades.length > 0) || 
            (r.capacitaciones && r.capacitaciones.length > 0)
          );

          if (reporteConDatos) {
            console.log("Reporte con datos encontrado:", {
              necesidades: reporteConDatos.necesidades?.length,
              capacitaciones: reporteConDatos.capacitaciones?.length,
              fecha: reporteConDatos.fechaGenerado
            });
            
            setCarruselData({
              necesidades: reporteConDatos.necesidades || [],
              capacitaciones: reporteConDatos.capacitaciones || [],
              resumenFisico: reporteConDatos.resumenFisico,
              resumenEmocional: reporteConDatos.resumenEmocional,
              tieneDatos: true,
              fecha: reporteConDatos.fechaGenerado,
              esReporteAnterior: reporteConDatos !== reportesOrdenados[0]
            });
          } else {
            console.log("No se encontraron reportes con necesidades/capacitaciones");
            setCarruselData({
              necesidades: [{
                tipo: "Formulario Pendiente",
                descripcion: "Por favor complete el formulario enviado a su correo",
                esPlaceholder: true
              }],
              capacitaciones: [{
                nombre: "Formulario Pendiente", 
                descripcion: "Por favor complete el formulario enviado a su correo",
                esPlaceholder: true
              }],
              resumenFisico: null,
              resumenEmocional: null,
              tieneDatos: false,
              fecha: null
            });
          }
        } else {
          console.log("No se encontraron reportes");
          setCarruselData({
            necesidades: [{
              tipo: "Formulario Pendiente",
              descripcion: "Por favor complete el formulario enviado a su correo",
              esPlaceholder: true
            }],
            capacitaciones: [{
              nombre: "Formulario Pendiente", 
              descripcion: "Por favor complete el formulario enviado a su correo",
              esPlaceholder: true
            }],
            resumenFisico: null,
            resumenEmocional: null,
            tieneDatos: false,
            fecha: null
          });
        }
      } catch (error) {
        console.error('Error al cargar voluntario:', error);
        setCarruselData({
          necesidades: [{
            tipo: "Error",
            descripcion: "No se pudieron cargar los datos. Intente nuevamente más tarde.",
            esPlaceholder: true
          }],
          capacitaciones: [{
            nombre: "Error", 
            descripcion: "No se pudieron cargar los datos. Intente nuevamente más tarde.",
            esPlaceholder: true
          }],
          resumenFisico: null,
          resumenEmocional: null,
          tieneDatos: false,
          fecha: null
        });
      } finally {
        setLoadingVoluntario(false);
        Animated.timing(blueAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }).start();
      }
    };

    fetchVoluntario();
  }, []);


  useEffect(() => {
    let intervalId;

    const iniciarSeguimiento = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const ci = getLoggedCi();
      const voluntario = await getVoluntarioByCi(ci);
      if (!voluntario) return;

      intervalId = setInterval(async () => {
        try {
          const location = await Location.getCurrentPositionAsync({});
          await crearHistorialUbicacion(
            location.coords.latitude,
            location.coords.longitude,
            voluntario.id.toString()
          );
        } catch (err) {
          console.error('Error guardando ubicación:', err.message);
        }
      }, 3600000); //3600000
    };

    iniciarSeguimiento();
    return () => clearInterval(intervalId);
  }, [voluntario?.id]);

  // Corregido: useEffect para animaciones del historial
  useEffect(() => {
    const currentHistorialData = getHistorialData();
    
    if (dotAnimsHistorial.current.length !== currentHistorialData.length) {
      dotAnimsHistorial.current = currentHistorialData.map((_, i) => 
        new Animated.Value(i === historialIndex ? 1 : 0)
      );
    }

    dotAnimsHistorial.current.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === historialIndex ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [historialIndex, carruselData]); // Agregada dependencia carruselData

  // Corregido: useEffect para animaciones de necesidades
  useEffect(() => {
    const currentNecesidadesData = getNecesidadesData();
    
    if (dotAnimsNecesidades.current.length !== currentNecesidadesData.length) {
      dotAnimsNecesidades.current = currentNecesidadesData.map((_, i) => 
        new Animated.Value(i === necesidadesIndex ? 1 : 0)
      );
    }

    dotAnimsNecesidades.current.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === necesidadesIndex ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [necesidadesIndex, carruselData]);

  const openInfo = () => {
    setInfoVisible(true);
    Animated.timing(panelAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const openEmergencia = () => {
    setEmergenciaVisible(true);
    Animated.timing(panelAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const closeEmergencia = () => {
    Animated.timing(panelAnim, { toValue: 1000, duration: 300, useNativeDriver: true }).start(() =>
      setEmergenciaVisible(false)
    );
  };

  const closeInfo = () => {
    Animated.timing(panelAnim, { toValue: 1000, duration: 300, useNativeDriver: true }).start(() =>
      setInfoVisible(false),
    );
  };

  const renderDots = (count, animsArray) => (
    <View style={styles.dotsContainer}>
      {animsArray.slice(0, count).map((anim, i) => {
        const backgroundColor = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [colors.white, colors.verdeOscuro],
        });
        return <Animated.View key={i} style={[styles.dot, { backgroundColor }]} />;
      })}
    </View>
  );

  const renderCarouselItem = ({ item }) => (
    <View style={{ width: width - 64 }}>
      <Text style={styles.carouselSectionTitle}>{item.titulo}</Text>
      {item.items.map((subItem, idx) => (
        <TouchableOpacity 
          key={idx} 
          style={[
            styles.widgetCard,
            subItem.esPlaceholder && styles.placeholderCard
          ]} 
          onPress={() => !subItem.esPlaceholder && navigation.navigate(item.screen)}
        >
          <Text style={[
            styles.itemTitle,
            subItem.esPlaceholder && styles.placeholderTitle
          ]}>
            {subItem.titulo || subItem.tipo || subItem.nombre}
          </Text>
          
          {/* Mostrar fecha solo si no es un placeholder */}
          {!subItem.esPlaceholder && subItem.fecha && subItem.fecha !== 'Fecha no disponible' && (
            <Text style={styles.itemSubtitle}>
              Actualizado: {subItem.fecha}
            </Text>
          )}
          
          <Text style={[
            styles.itemSubtitle,
            subItem.esPlaceholder && styles.placeholderSubtitle
          ]}>
            {subItem.descripcion}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loadingVoluntario) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.fondo }]}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.verdeOscuro} />
          <Text style={styles.loadingText}>Cargando tu perfil...</Text>
          <Text style={styles.loadingSubtext}>Por favor espera un momento</Text>
        </View>
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
    <Animated.View style={[styles.container, { backgroundColor: colors.fondo, opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Animated.View style={[styles.greenContainer, { transform: [{ translateY: blueAnim }] }]} />

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 10 }}>

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
              <Ionicons name="information-circle-outline" size={24} color={colors.verdeOscuro} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate("Evaluaciones")}>
              <Ionicons name="document-text-outline" size={24} color={colors.verdeOscuro} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate("Solicitudes")}>
              <Ionicons name="file-tray-full-outline" size={24} color={colors.verdeOscuro} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.emergenciaButton} onPress={openEmergencia}>
              <Ionicons name="megaphone-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

        </View>

        {/* Historial */}
        <TouchableOpacity style={styles.sectionCard} activeOpacity={0.9} onPress={() => navigation.navigate('Historial')}>
          <Animated.FlatList
            data={getHistorialData()}
            renderItem={renderCarouselItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollXHistorial } } }], { useNativeDriver: false })}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / (width - 64));
              setHistorialIndex(newIndex);
            }}
            scrollEventThrottle={16}
          />
          {renderDots(getHistorialData().length, dotAnimsHistorial.current)}
        </TouchableOpacity>

        {/* Necesidades y Capacitaciones */}
        <TouchableOpacity 
          style={styles.sectionCard} 
          activeOpacity={0.9} 
          onPress={() => navigation.navigate('NecesidadesCapacitaciones')}
        >
          <Animated.FlatList
            data={getNecesidadesData()}
            renderItem={renderCarouselItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollXNecesidades } }}], 
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / (width - 64));
              setNecesidadesIndex(newIndex);
            }}
            scrollEventThrottle={16}
          />
          {renderDots(getNecesidadesData().length, dotAnimsNecesidades.current)}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Información Voluntario */}
      <Modal transparent visible={infoVisible} animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={closeInfo} />
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: panelAnim }] }]}>
          <Text style={styles.modalTitle}>Información del Voluntario</Text>

          <View style={styles.infoRow}>
            <FontAwesome5 name="user" size={20} color={colors.verdeOscuro} />
            <Text style={styles.infoText}>{voluntario.nombre} {voluntario.apellido}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="id-card" size={20} color={colors.verdeOscuro} />
            <Text style={styles.infoText}>{voluntario.ci}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="phone" size={20} color={colors.verdeOscuro} />
            <Text style={styles.infoText}>{voluntario.telefono}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="tint" size={20} color={colors.verdeOscuro} />
            <Text style={styles.infoText}>{voluntario.tipo_sangre}</Text>
          </View>
        </Animated.View>
      </Modal>

      <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        keyboardVerticalOffset={Platform.select({
          ios: 40,
          android: 0
        })}>
        <Modal transparent visible={emergenciaVisible} animationType="fade">
          <Pressable style={styles.modalBackdrop} onPress={closeEmergencia} />

          <Animated.View style={[styles.modalContent, { transform: [{ translateY: panelAnim }] }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
            

              <Text style={styles.modalTitle}>Reportar Emergencia</Text>

              {/* Tipo de emergencia */}
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Tipo de emergencia</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={[
                    { label: 'Físico', value: 'Fisico' },
                    { label: 'Emocional', value: 'Emocional' },
                    { label: 'Recurso', value: 'Recurso' },
                  ]}
                  maxHeight={200}
                  labelField="label"
                  valueField="value"
                  placeholder="Selecciona un tipo"
                  value={tipo}
                  onChange={item => setTipo(item.value)}
                />
              </View>

              {/* Nivel de emergencia */}
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Nivel de emergencia</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={[
                    { label: 'Bajo', value: '1' },
                    { label: 'Medio', value: '3' },
                    { label: 'Alto', value: '5' },
                  ]}
                  maxHeight={200}
                  labelField="label"
                  valueField="value"
                  placeholder="Selecciona un nivel"
                  value={nivel}
                  onChange={item => setNivel(item.value)}
                />
              </View>

              {/* Descripción */}
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Descripción</Text>
                <TextInput
                  placeholder="Describe brevemente la emergencia..."
                  multiline
                  style={[styles.input, styles.descripcionInput]}
                  value={descripcion}
                  onChangeText={setDescripcion}
                />
              </View>
              {/* Botón */}
              <TouchableOpacity style={styles.enviarButton} onPress={handleEnviarSolicitud}>
                <Text style={styles.enviarButtonText}>ENVIAR</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </Modal>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}