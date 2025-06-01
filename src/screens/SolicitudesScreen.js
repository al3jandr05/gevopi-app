import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  Animated, Pressable, Modal, Platform
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles/solicitudesStyles';
import colors from '../themes/colors';
import { useNavigation } from '@react-navigation/native';

import { getLoggedCi } from '../services/authService';
import { getVoluntarioByCi } from '../services/voluntarioService';
import { obtenerTodasSolicitudes } from '../services/queriesNOSQL';

export default function SolicitudesScreen() {
  const navigation = useNavigation();
  const panelAnim = useRef(new Animated.Value(500)).current;
  const searchWidthAnim = useRef(new Animated.Value(1)).current;
  const reiniciarOpacity = useRef(new Animated.Value(0)).current;

  const [solicitudes, setSolicitudes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pickerDate, setPickerDate] = useState(null);

  const [filtros, setFiltros] = useState({ tipo: null, nivel: null, estado: null, fecha: null });
  const [tempFiltros, setTempFiltros] = useState({ tipo: null, nivel: null, estado: null, fecha: null });

  const hayFiltros = Object.values(filtros).some(v => v);

  const cargarSolicitudes = async () => {
    try {
      const ci = getLoggedCi();
      const voluntario = await getVoluntarioByCi(ci);
      const todas = await obtenerTodasSolicitudes();
      const propias = todas.filter(s => s.voluntarioId !== voluntario.id.toString());
      setSolicitudes(propias);
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
    const filtrados = solicitudes.filter(s => {
      const coincideTipo = !filtros.tipo || s.tipo === filtros.tipo;
      const coincideNivel = !filtros.nivel || s.nivelEmergencia === filtros.nivel;
      const coincideEstado = !filtros.estado || s.estado === filtros.estado;
      const coincideFecha = !filtros.fecha || new Date(s.fecha).toDateString() === new Date(filtros.fecha).toDateString();
      const coincideBusqueda = s.descripcion.toLowerCase().includes(search.toLowerCase());
      return coincideTipo && coincideNivel && coincideEstado && coincideFecha && coincideBusqueda;
    });
    setFiltered(filtrados);
  }, [filtros, search, solicitudes]);

  const abrirPanel = () => {
    setTempFiltros({ ...filtros });
    setShowFilters(true);
    Animated.timing(panelAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const cerrarPanel = () => {
    Animated.timing(panelAnim, { toValue: 500, duration: 300, useNativeDriver: true }).start(() => setShowFilters(false));
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

  const getNivelColor = (nivel) => {
    switch (nivel?.toUpperCase()) {
      case 'ALTO': return '#D32F2F';   // Rojo
      case 'MEDIO': return '#FBC02D';  // Amarillo
      case 'BAJO': return '#388E3C';   // Verde
      default: return '#9E9E9E';       // Gris por defecto
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DetalleSolicitud', { solicitud: item })}>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <Text style={styles.cardTitle}>{item.tipo}</Text>
          <Text style={{
            backgroundColor: getNivelColor(item.nivelEmergencia),
            color: 'white',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 'bold',
            overflow: 'hidden',
          }}>
            {item.nivelEmergencia}
          </Text>
        </View>

        <Text style={styles.cardSubtitle}>{item.descripcion}</Text>
        <Text style={styles.cardFecha}>📅 {new Date(item.fecha).toLocaleDateString()}</Text>

        <View style={{ height: 150, marginVertical: 10, borderRadius: 10, overflow: 'hidden' }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: parseFloat(item.latitud),
              longitude: parseFloat(item.longitud),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker coordinate={{ latitude: parseFloat(item.latitud), longitude: parseFloat(item.longitud) }} />
          </MapView>
        </View>

        <Text style={styles.cardState}>Estado: {item.estado}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.verdeOscuro} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solicitudes</Text>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity onPress={abrirPanel} style={[styles.filtroButton]}>
          <FontAwesome5 name="filter" size={18} color={colors.verdeOscuro} />
        </TouchableOpacity>

        <Animated.View style={{ flex: searchWidthAnim }}>
          <TextInput
            placeholder="Buscar por descripción..."
            style={styles.search}
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay resultados.</Text>}
      />

      {/* Filtros Modal */}
      {showFilters && (
        <View style={styles.modalOverlay}>
          <Pressable style={{ flex: 1 }} onPress={cerrarPanel} />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: panelAnim }] }]}>
            <Text style={styles.modalTitle}>Filtros</Text>

            <Text style={styles.filterLabel}>Tipo</Text>
            <Dropdown
              style={styles.input}
              data={[{ label: 'Fisica', value: 'Fisica' }, { label: 'Psicologica', value: 'Psicologica' }]}
              labelField="label"
              valueField="value"
              value={tempFiltros.tipo}
              placeholder="Selecciona tipo"
              onChange={item => setTempFiltros(prev => ({ ...prev, tipo: item.value }))}
            />

            <Text style={styles.filterLabel}>Nivel</Text>
            <Dropdown
              style={styles.input}
              data={[{ label: 'BAJO', value: 'BAJO' }, { label: 'MEDIO', value: 'MEDIO' }, { label: 'ALTO', value: 'ALTO' }]}
              labelField="label"
              valueField="value"
              value={tempFiltros.nivel}
              placeholder="Selecciona nivel"
              onChange={item => setTempFiltros(prev => ({ ...prev, nivel: item.value }))}
            />

            <Text style={styles.filterLabel}>Estado</Text>
            <Dropdown
              style={styles.input}
              data={[{ label: 'Sin responder', value: 'Sin responder' }, { label: 'En progreso', value: 'En progreso' }, { label: 'Respondido', value: 'Respondido' }]}
              labelField="label"
              valueField="value"
              value={tempFiltros.estado}
              placeholder="Selecciona estado"
              onChange={item => setTempFiltros(prev => ({ ...prev, estado: item.value }))}
            />

            <Text style={styles.filterLabel}>Fecha</Text>
            <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.datePicker}>
              <Text>{tempFiltros.fecha ? tempFiltros.fecha.toLocaleDateString() : 'Seleccionar fecha'}</Text>
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
            textColor={Platform.OS === 'ios' ? colors.verdeOscuro : undefined}
            themeVariant={Platform.OS === 'ios' ? "light" : undefined}
          />
        </View>
      </Modal>
    </View>
  );
}
