import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Animated, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import styles from '../styles/historialStyles';
import colors from '../themes/colors';

const HistorialScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState(null);
  const [tempTipoFiltro, setTempTipoFiltro] = useState(null);

  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [tempDesde, setTempDesde] = useState(null);
  const [tempHasta, setTempHasta] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [showRangoFechas, setShowRangoFechas] = useState(false);

  const [pickerType, setPickerType] = useState(null);
  const [pickerValue, setPickerValue] = useState(null);

  const panelAnim = useRef(new Animated.Value(500)).current;
  const reiniciarOpacity = useRef(new Animated.Value(0)).current;
  const searchWidthAnim = useRef(new Animated.Value(1)).current;

  const historial = [
    { tipo: "clinico", titulo: "Fractura de Brazo", descripcion: "Lesión durante el fuego en Samaipata", fecha: "2025-05-20" },
    { tipo: "psicologico", titulo: "Migraña leve", descripcion: "Síntoma después de combate prolongado", fecha: "2025-03-18" },
    { tipo: "psicologico", titulo: "Estrés Agudo", descripcion: "Detectado después de un evento traumático", fecha: "2025-03-15" },
    { tipo: "psicologico", titulo: "Ansiedad Leve", descripcion: "Revisión por exposición prolongada", fecha: "2024-11-02" },
  ];

  const hayFiltrosActivos = tipoFiltro || fechaDesde || fechaHasta;

  const aplicarFiltros = () => {
    setTipoFiltro(tempTipoFiltro);
    setFechaDesde(tempDesde);
    setFechaHasta(tempHasta);
    cerrarPanel();
  };

  const reiniciarFiltros = () => {
    setSearch('');
    setTipoFiltro(null);
    setFechaDesde(null);
    setFechaHasta(null);

    Animated.parallel([
      Animated.timing(reiniciarOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(searchWidthAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  const abrirPanel = () => {
    setTempTipoFiltro(tipoFiltro);
    setTempDesde(fechaDesde);
    setTempHasta(fechaHasta);
    setShowFilters(true);
    Animated.timing(panelAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const cerrarPanel = () => {
    setShowRangoFechas(false);
    Animated.timing(panelAnim, { toValue: 500, duration: 300, useNativeDriver: true }).start(() => setShowFilters(false));
  };

  const abrirPicker = (type) => {
    setPickerType(type);
    setPickerValue(type === "Desde" ? tempDesde : tempHasta);
  };

  const onDateChange = (event, selectedDate) => {
    if (pickerType === "Desde") setTempDesde(selectedDate);
    else setTempHasta(selectedDate);
    setPickerType(null);
  };

  if (hayFiltrosActivos) {
    Animated.parallel([
      Animated.timing(reiniciarOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(searchWidthAnim, { toValue: 0.75, duration: 300, useNativeDriver: false }),
    ]).start();
  }

  const filtrados = historial.filter(item => {
    if (tipoFiltro && item.tipo !== tipoFiltro) return false;

    const fecha = new Date(item.fecha);
    if (fechaDesde && fecha < fechaDesde) return false;
    if (fechaHasta && fecha > fechaHasta) return false;

    if (search.length > 0 && !item.titulo.toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial</Text>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity onPress={abrirPanel} style={[styles.filtroButton, { backgroundColor: hayFiltrosActivos ? colors.darkBlue : colors.white }]}>
          <FontAwesome5 name="filter" size={18} color={hayFiltrosActivos ? colors.white : colors.darkBlue} />
        </TouchableOpacity>

        <Animated.View style={{ flex: searchWidthAnim }}>
          <TextInput
            placeholder="Buscar historial..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.darkBlue}
          />
        </Animated.View>

        <Animated.View style={{ opacity: reiniciarOpacity }}>
          <TouchableOpacity onPress={reiniciarFiltros} style={styles.reiniciarButton}>
            <Ionicons name="close" size={20} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No se encontraron resultados.{"\n"}Presione X para reiniciar los filtros.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardSubtitle}>{item.descripcion}</Text>
            <Text style={styles.cardSubtitle}>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
          </View>
        )}
      />

      {showFilters && (
        <View style={styles.modalOverlay}>
          <Pressable style={{ flex: 1 }} onPress={cerrarPanel} />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: panelAnim }] }]}>
            <Text style={styles.modalTitle}>Filtros</Text>

            <Text style={styles.filterLabel}>Tipo de Historial</Text>
            <View style={styles.chipsRow}>
              {["clinico", "psicologico"].map(tipo => (
                <Pressable
                  key={tipo}
                  style={[styles.choiceChip, tempTipoFiltro === tipo && styles.choiceChipSelected]}
                  onPress={() => setTempTipoFiltro(tipo)}
                >
                  <Text style={{ color: tempTipoFiltro === tipo ? colors.white : colors.darkBlue }}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <TouchableOpacity onPress={() => setShowRangoFechas(!showRangoFechas)} style={styles.datePicker}>
              <Text>Rango de Fecha {showRangoFechas ? "(Ocultar)" : "(Mostrar)"}</Text>
            </TouchableOpacity>

            {showRangoFechas && (
              <>
                <TouchableOpacity onPress={() => abrirPicker("Desde")} style={styles.datePicker}>
                  <Text>Desde: {tempDesde ? tempDesde.toLocaleDateString() : "----"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => abrirPicker("Hasta")} style={styles.datePicker}>
                  <Text>Hasta: {tempHasta ? tempHasta.toLocaleDateString() : "----"}</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={aplicarFiltros} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {pickerType && (
        <DateTimePicker
          value={pickerValue || new Date()}
          mode="date"
          display="calendar"
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

export default HistorialScreen;
