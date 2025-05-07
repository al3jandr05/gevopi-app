import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Animated, Modal, Dimensions, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from '../styles/perfilStyles';
import colors from '../themes/colors';

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
      { titulo: 'Dolor en el Abdomen', descripcion: 'Síntoma después de estar 8 horas combatiendo el fuego', fecha: '19/5/2025' }
    ]
  },
  {
    titulo: 'Historial Psicológico',
    screen: 'HistorialScreen',
    items: [
      { titulo: 'Ansiedad', descripcion: 'Post incendio', fecha: '22/5/2025' },
      { titulo: 'Estrés agudo', descripcion: 'Durante rescate', fecha: '18/5/2025' }
    ]
  }
];

const necesidadesData = [
  {
    titulo: 'Necesidades',
    screen: 'NecesidadesCapacitacionesScreen',
    items: [
      { titulo: 'Primeros Auxilios', descripcion: 'Curso básico de RCP' },
      { titulo: 'Rescate en Incendios', descripcion: 'Técnicas de intervención' }
    ]
  },
  {
    titulo: 'Capacitaciones',
    screen: 'NecesidadesCapacitacionesScreen',
    items: [
      { titulo: 'Atención de víctimas', descripcion: 'Capacitación psicológica' },
      { titulo: 'Técnicas de Evacuación', descripcion: 'Formación avanzada' }
    ]
  }
];

export default function PerfilScreen() {
  const [infoVisible, setInfoVisible] = useState(false);
  const [stressLevel, setStressLevel] = useState(7);
  const [historialIndex, setHistorialIndex] = useState(0);
  const [necesidadesIndex, setNecesidadesIndex] = useState(0);
  const navigation = useNavigation();
  const panelAnim = useRef(new Animated.Value(500)).current;
  const scrollXHistorial = useRef(new Animated.Value(0)).current;
  const scrollXNecesidades = useRef(new Animated.Value(0)).current;

  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const openInfo = () => {
    setInfoVisible(true);
    Animated.timing(panelAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const closeInfo = () => {
    Animated.timing(panelAnim, { toValue: 500, duration: 300, useNativeDriver: true }).start(() => setInfoVisible(false));
  };

  const getStressColor = (level) => {
    if (level <= 3) return [colors.green, colors.cyan];
    if (level <= 6) return [colors.yellow, colors.orange];
    return [colors.red, '#d90429'];
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

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.lighterCyan, opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Perfil */}
        <View style={styles.perfilContainer}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder} />
            <View style={[styles.statusDot, { backgroundColor: 'green' }]} />
          </View>
          <Text style={styles.name}>Juan Pérez</Text>
          <Text style={styles.stressText}>Nivel de estrés</Text>
          <View style={styles.stressBar}>
            <View style={[styles.stressFill, { width: `${stressLevel * 10}%`, backgroundColor: getStressColor(stressLevel)[0] }]} />
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.circleButton} onPress={openInfo}>
              <FontAwesome5 name="info" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate("Evaluaciones")}>
              <FontAwesome5 name="clipboard-list" size={20} color="white" />
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
          <Text style={styles.sectionTitle}>Historial</Text>
          <Animated.FlatList
            data={historialData}
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
          {renderDots(historialData.length, historialIndex)}
        </TouchableOpacity>

        {/* Necesidades y Capacitaciones */}
        <TouchableOpacity style={styles.sectionCard} activeOpacity={0.9} onPress={() => navigation.navigate('NecesidadesCapacitaciones')}>
          <Text style={styles.sectionTitle}>Necesidades y Capacitaciones</Text>
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
            <Text style={styles.infoText}>Juan Pérez</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="id-card" size={20} color={colors.darkBlue} />
            <Text style={styles.infoText}>97841123</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="phone" size={20} color={colors.darkBlue} />
            <Text style={styles.infoText}>+591 76291234</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="tint" size={20} color={colors.darkBlue} />
            <Text style={styles.infoText}>A+</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="fire" size={20} color={colors.darkBlue} />
            <Text style={styles.infoText}>12</Text>
          </View>
        </Animated.View>
      </Modal>
    </Animated.View>
  );
}
