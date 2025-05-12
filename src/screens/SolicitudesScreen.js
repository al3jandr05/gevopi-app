import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  Animated, Pressable, Modal, Platform
} from 'react-native';
import styles from '../styles/solicitudesStyles';
import colors from '../themes/colors';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { obtenerTodasSolicitudes } from '../services/queriesNOSQL';
import { actualizarSolicitudEnProgreso, marcarSolicitudRespondida } from '../services/mutationsNOSQL';
import { getVoluntarioByEmail, getVoluntarioById } from '../services/voluntarioService';
import { getLoggedEmail } from '../services/authService';

const prioridad = { ALTO: 3, MEDIO: 2, BAJO: 1 };

export default function SolicitudesScreen() {
  const navigation = useNavigation();
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [voluntarioNombre, setVoluntarioNombre] = useState('');
  const [infoVisible, setInfoVisible] = useState(false);
  const [panelAnim] = useState(new Animated.Value(500));
  const [solicitudDetalle, setSolicitudDetalle] = useState(null);


  // Filtros
  const [filtros, setFiltros] = useState({ tipo: null, nivel: null, estado: null, fecha: null });
  const [tempFiltros, setTempFiltros] = useState({ tipo: null, nivel: null, estado: null, fecha: null });
  const [showFilters, setShowFilters] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const reiniciarOpacity = useRef(new Animated.Value(0)).current;
  const searchWidthAnim = useRef(new Animated.Value(1)).current;

  const hayFiltros = Object.values(filtros).some(v => v);

  const cargarSolicitudes = async () => {
    try {
      const email = getLoggedEmail();
      const voluntarioActual = await getVoluntarioByEmail(email);
      const todas = await obtenerTodasSolicitudes();
      const propias = todas.filter(s => s.voluntarioId !== voluntarioActual.id.toString());
      const ordenadas = propias.sort((a, b) => prioridad[b.nivelEmergencia] - prioridad[a.nivelEmergencia]);
      setSolicitudes(ordenadas);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);


  useEffect(() => {
    const resultados = solicitudes.filter(s => {
      const coincideTipo = !filtros.tipo || s.tipo.toLowerCase() === filtros.tipo.toLowerCase();
      const coincideNivel = !filtros.nivel || s.nivelEmergencia === filtros.nivel;
      const coincideEstado = !filtros.estado || s.estado?.toLowerCase() === filtros.estado.toLowerCase();
      const coincideFecha = !filtros.fecha || new Date(s.fecha).toDateString() === filtros.fecha.toDateString();
      const coincideBusqueda = s.descripcion.toLowerCase().includes(search.toLowerCase());

      return coincideTipo && coincideNivel && coincideEstado && coincideFecha && coincideBusqueda;
    });
    setFiltered(resultados);
  }, [filtros, search, solicitudes]);

  const abrirPanel = () => {
    setTempFiltros({ ...filtros });
    setShowFilters(true);
    Animated.timing(panelAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const cerrarPanel = () => {
    Animated.timing(panelAnim, { toValue: 500, duration: 300, useNativeDriver: true }).start(() => setShowFilters(false));
  };

  const openDetalle = (item) => {
    setSolicitudDetalle(item);
    setInfoVisible(true);
    Animated.timing(panelAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDetalle = () => {
    Animated.timing(panelAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setInfoVisible(false);
      setSolicitudDetalle(null);
    });
  };

  const aplicarFiltros = () => {
    setFiltros({ ...tempFiltros });
    cerrarPanel();
  };

  const reiniciarFiltros = () => {
    setSearch('');
    setFiltros({ tipo: null, nivel: null, estado: null, fecha: null });
    Animated.parallel([
      Animated.timing(reiniciarOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(searchWidthAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  if (hayFiltros) {
    Animated.parallel([
      Animated.timing(reiniciarOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(searchWidthAnim, { toValue: 0.75, duration: 300, useNativeDriver: false }),
    ]).start();
  }
  const getColorPorEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'Sin respuesta':
        return '#999';
      case 'en progreso':
        return '#FFA500';
      case 'respondido':
        return '#388E3C';
      default:
        return '#666';
    }
  };

  const getColorPorNivel = (nivel) => {
    switch (nivel?.toUpperCase()) {
      case 'ALTO':
        return '#D32F2F'; // rojo fuerte
      case 'MEDIO':
        return '#FBC02D'; // amarillo
      case 'BAJO':
        return '#388E3C'; // verde
      default:
        return '#9E9E9E'; // gris neutro
    }
  };



  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openDetalle(item)}>
      <View style={[styles.card, { borderLeftColor: getColorPorNivel(item.nivelEmergencia), borderLeftWidth: 6 }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTipo}>{item.tipo?.toUpperCase()}</Text>
          <Text style={[styles.cardNivel, { backgroundColor: getColorPorNivel(item.nivelEmergencia) }]}>
            {item.nivelEmergencia}
          </Text>
        </View>

        <Text style={styles.cardDescripcion}>{item.descripcion}</Text>

        <Text style={styles.cardFecha}>
          📅 {new Date(item.fecha).toLocaleString()}
        </Text>

        <View style={styles.cardMapaContainer}>
          <MapView
            style={styles.cardMapa}
            initialRegion={{
              latitude: parseFloat(item.latitud),
              longitude: parseFloat(item.longitud),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(item.latitud),
                longitude: parseFloat(item.longitud),
              }}
            />
          </MapView>
        </View>

        <Text style={[styles.cardEstado, { color: getColorPorEstado(item.estado) }]}>
          Estado: {item.estado}
        </Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solicitudes</Text>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity onPress={abrirPanel} style={[styles.filtroButton, { backgroundColor: hayFiltros ? colors.verdeOscuro : colors.fondo }]}>
          <FontAwesome5 name="filter" size={18} color={hayFiltros ? colors.white : colors.verdeOscuro} />
        </TouchableOpacity>

        <Animated.View style={{ flex: searchWidthAnim }}>
          <TextInput
            placeholder="Buscar por descripción..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </Animated.View>

        <Animated.View style={{ opacity: reiniciarOpacity }}>
          <TouchableOpacity onPress={reiniciarFiltros} style={styles.reiniciarButton}>
            <Ionicons name="close" size={20} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron solicitudes.</Text>
          </View>
        )}
      />

      {showFilters && (
        <View style={styles.modalOverlay}>
          <Pressable style={{ flex: 1 }} onPress={cerrarPanel} />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: panelAnim }] }]}>
            <Text style={styles.modalTitle}>Filtros</Text>

            {["tipo", "nivel", "estado"].map((key) => {
              const opciones = key === "tipo"
                ? ["Fisica", "Psicologica"]
                : key === "nivel"
                  ? ["BAJO", "MEDIO", "ALTO"]
                  : ["Sin Responder", "En Progreso", "Respondido"];

              return (
                <View key={key}>
                  <Text style={styles.filterLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <View style={styles.chipsRow}>
                    {opciones.map(op => (
                      <Pressable
                        key={op}
                        style={[styles.choiceChip, tempFiltros[key] === op && styles.choiceChipSelected]}
                        onPress={() => setTempFiltros(prev => ({ ...prev, [key]: op }))}
                      >
                        <Text style={{ color: tempFiltros[key] === op ? colors.white : colors.dark }}>{op}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              );
            })}

            <Text style={styles.filterLabel}>Fecha</Text>
            <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.datePicker}>
              <Text>Fecha: {tempFiltros.fecha ? tempFiltros.fecha.toLocaleDateString() : '----'}</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={aplicarFiltros} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      <Modal visible={pickerVisible} transparent animationType="fade">
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={() => setPickerVisible(false)} />
        <View style={{ backgroundColor: colors.white, padding: 16, borderRadius: 12, margin: 20 }}>
          <DateTimePicker
            value={tempFiltros.fecha || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? "inline" : "calendar"}
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setTempFiltros(prev => ({ ...prev, fecha: selectedDate }));
              }
              setPickerVisible(false);
            }}
            textColor={Platform.OS === 'ios' ? colors.darkBlue : undefined}
            themeVariant={Platform.OS === 'ios' ? "light" : undefined}
          />
        </View>
      </Modal>

      <Modal transparent visible={infoVisible} animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={closeDetalle} />
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: panelAnim }] }]}>
          <TouchableOpacity style={styles.closeButton} onPress={closeDetalle}>
            <FontAwesome5 name="times" size={20} color={colors.verdeOscuro} />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Detalles de la Solicitud</Text>

          <View style={styles.infoRow}>
            <FontAwesome5 name="file-alt" size={20} color={colors.verdeOscuro} />
            <Text style={styles.infoText}>{solicitudDetalle?.descripcion}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="calendar" size={20} color={colors.verdeOscuro} />
            <Text style={styles.infoText}>{new Date(solicitudDetalle?.fecha).toLocaleString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="heartbeat" size={20} color={colors.verdeOscuro} />
            <Text style={styles.infoText}>Tipo: {solicitudDetalle?.tipo}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="exclamation-triangle" size={20} color={colors.verdeOscuro} />
            <Text style={styles.infoText}>Nivel: {solicitudDetalle?.nivelEmergencia}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="check-circle" size={20} color={colors.verdeOscuro} />
            <Text style={styles.infoText}>Estado: {solicitudDetalle?.estado}</Text>
          </View>
        </Animated.View>
      </Modal>


    </View>
  );
}
