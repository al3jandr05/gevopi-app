import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Animated, Pressable, Modal, Platform } from 'react-native';
import colors from '../themes/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/evaluacionesStyles';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

const EvaluacionesScreen = () => {
  const navigation = useNavigation();

  const [search, setSearch] = useState('');

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    estado: null,
    desde: null,
    hasta: null,
  });

  const [filtrosTemp, setFiltrosTemp] = useState({
    estado: null,
    desde: null,
    hasta: null,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [pickerType, setPickerType] = useState(null);
  const [pickerValue, setPickerValue] = useState(null);
  const [mostrarRangoFechas, setMostrarRangoFechas] = useState(false);


  const panelAnim = useRef(new Animated.Value(500)).current;
  const reiniciarOpacity = useRef(new Animated.Value(0)).current;
  const searchWidthAnim = useRef(new Animated.Value(1)).current;

  const evaluaciones = [
    { titulo: "Evaluación física post-incendio", fechaRealizada: "2025-03-10", fechaResultado: "2025-03-12" },
    { titulo: "Evaluación psicológica inicial", fechaRealizada: "2025-03-05", fechaResultado: null },
    { titulo: "Evaluación estrés crónico", fechaRealizada: "2025-02-15", fechaResultado: "2025-02-17" },
    { titulo: "Revisión mensual", fechaRealizada: "2025-02-01", fechaResultado: null },
  ];

  const hayFiltrosActivos = filtrosAplicados.estado !== null || filtrosAplicados.desde || filtrosAplicados.hasta;

  const abrirPanel = () => {
    setFiltrosTemp({ ...filtrosAplicados });
    setShowFilters(true);
    Animated.timing(panelAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const cerrarPanel = () => {
    Animated.timing(panelAnim, { toValue: 500, duration: 300, useNativeDriver: true }).start(() => setShowFilters(false));
  };

  const aplicarFiltros = () => {
    setFiltrosAplicados({ ...filtrosTemp });
    cerrarPanel();
  };

  const reiniciarFiltros = () => {
    setSearch('');
    setFiltrosAplicados({
      estado: null,
      desde: null,
      hasta: null,
    });

    Animated.parallel([
      Animated.timing(reiniciarOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(searchWidthAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  const abrirPicker = (type) => {
    setPickerType(type);
    setPickerValue(type === "Desde" ? filtrosTemp.desde : filtrosTemp.hasta);
  };

  const onDateChange = (event, selectedDate) => {
    if (pickerType === "Desde") setFiltrosTemp(prev => ({ ...prev, desde: selectedDate }));
    else setFiltrosTemp(prev => ({ ...prev, hasta: selectedDate }));
    setPickerType(null);
  };

  if (hayFiltrosActivos) {
    Animated.parallel([
      Animated.timing(reiniciarOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(searchWidthAnim, { toValue: 0.75, duration: 300, useNativeDriver: false }),
    ]).start();
  }

  const filtrados = evaluaciones.filter(e => {
    const estado = filtrosAplicados.estado;
    const desde = filtrosAplicados.desde;
    const hasta = filtrosAplicados.hasta;

    const tieneResultado = !!e.fechaResultado;

    if (estado === "Realizada" && tieneResultado) return false;
    if (estado === "Entregada" && !tieneResultado) return false;

    const fecha = new Date(e.fechaRealizada);
    if (desde && fecha < desde) return false;
    if (hasta && fecha > hasta) return false;

    if (search.length > 0 && !e.titulo.toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Evaluaciones</Text>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity onPress={abrirPanel} style={[styles.filtroButton, { backgroundColor: hayFiltrosActivos ? colors.darkBlue : colors.white }]}>
          <FontAwesome5 name="filter" size={18} color={hayFiltrosActivos ? colors.white : colors.darkBlue} />
        </TouchableOpacity>

        <Animated.View style={{ flex: searchWidthAnim }}>
          <TextInput
            placeholder="Buscar evaluación..."
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
        data={filtrados}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const entregada = item.fechaResultado !== null;
          return (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardSubtitle}>Fecha realizada: {item.fechaRealizada}</Text>
              {entregada && <Text style={styles.cardSubtitle}>Resultado entregado: {item.fechaResultado}</Text>}
              {entregada && (
                <TouchableOpacity style={styles.verButton} onPress={() => navigation.navigate('ResultadoEvaluaciones', { evaluacion: item })}>
                  <Text style={styles.verButtonText}>Ver resultado</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.darkBlue, textAlign: 'center', fontSize: 16 }}>
              No se encontraron resultados.
            </Text>
          </View>
        )}
      />


      {showFilters && (
        <View style={styles.modalOverlay}>
          <Pressable style={{ flex: 1 }} onPress={cerrarPanel} />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: panelAnim }] }]}>
            <Text style={styles.modalTitle}>Filtros</Text>

            <Text style={styles.filterLabel}>Estado de Evaluación</Text>
            <View style={styles.chipsRow}>
              {["Realizada", "Entregada"].map(tipo => (
                <Pressable
                  key={tipo}
                  style={[styles.choiceChip, filtrosTemp.estado === tipo && styles.choiceChipSelected]}
                  onPress={() => setFiltrosTemp(prev => ({ ...prev, estado: tipo }))}
                >
                  <Text style={{ color: filtrosTemp.estado === tipo ? colors.white : colors.dark }}>{tipo}</Text>
                </Pressable>
              ))}
            </View>

            {filtrosTemp.estado && (
              <>
                <TouchableOpacity onPress={() => setMostrarRangoFechas(!mostrarRangoFechas)} style={styles.rangoFechaToggle}>
                  <Text style={{ color: colors.darkBlue, fontWeight: 'bold' }}>Rango de Fechas</Text>
                  <Ionicons name={mostrarRangoFechas ? "chevron-up" : "chevron-down"} size={20} color={colors.darkBlue} />
                </TouchableOpacity>

                {mostrarRangoFechas && (
                  <>
                    <TouchableOpacity onPress={() => abrirPicker("Desde")} style={styles.datePicker}>
                      <Text>Desde: {filtrosTemp.desde ? filtrosTemp.desde.toLocaleDateString() : "----"}</Text>
                    </TouchableOpacity>

                    {filtrosTemp.estado === "Entregada" && (
                      <TouchableOpacity onPress={() => abrirPicker("Hasta")} style={styles.datePicker}>
                        <Text>Hasta: {filtrosTemp.hasta ? filtrosTemp.hasta.toLocaleDateString() : "----"}</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </>
            )}

            <TouchableOpacity onPress={aplicarFiltros} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* DateTimePicker bien hecho */}
      <Modal visible={pickerType !== null} transparent animationType="fade">
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={() => setPickerType(null)} />
        <View style={{ backgroundColor: colors.white, padding: 16, borderRadius: 12, margin: 20 }}>
          <DateTimePicker
            value={pickerValue || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? "inline" : "calendar"}
            onChange={onDateChange}
            textColor={Platform.OS === 'ios' ? colors.darkBlue : undefined}
            themeVariant={Platform.OS === 'ios' ? "light" : undefined}
          />
        </View>
      </Modal>




    </View>
  );
};

export default EvaluacionesScreen;
