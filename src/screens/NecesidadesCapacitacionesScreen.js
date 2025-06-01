import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Animated, Pressable, Modal, Platform } from 'react-native';
import colors from '../themes/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/necesidades_capacitacionesStyles';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { getLoggedEmail } from '../services/authService';
import { getVoluntarioByEmail } from '../services/voluntarioService';
import { obtenerReportePorVoluntarioId } from '../services/queriesSQL';

export default function NecesidadesCapacitacionesScreen() {
  const navigation = useNavigation();

  const [search, setSearch] = useState('');
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    tipo: null,
    desde: null,
    hasta: null,
  });
  const [filtrosTemp, setFiltrosTemp] = useState({
    tipo: null,
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

  const [items, setItems] = useState([]);

  const fetchData = async () => {
    try {
      const email = await getLoggedEmail(); 
      const voluntario = await getVoluntarioByEmail(email);

      console.log("Usuario matcheado:", voluntario);

      if (!voluntario || !voluntario.id) {
        console.log("No se encontró voluntario válido");
        return;
      }

      const reportes = await obtenerReportePorVoluntarioId(voluntario.id.toString());
      console.log("Reportes obtenidos:", reportes);

      if (reportes?.length > 0) {
        // Ordenar reportes por fecha (más reciente primero)
        const reportesOrdenados = [...reportes].sort(
          (a, b) => new Date(b.fechaGenerado) - new Date(a.fechaGenerado)
        );
        
        // Buscar el primer reporte que tenga necesidades o capacitaciones
        const reporteConDatos = reportesOrdenados.find(r => 
          (r.necesidades && r.necesidades.length > 0) || 
          (r.capacitaciones && r.capacitaciones.length > 0)
        );

        if (reporteConDatos) {
          console.log("Reporte con datos encontrado:", reporteConDatos);
          
          const necesidades = reporteConDatos.necesidades?.map((n) => ({
            tipo: "necesidad",
            titulo: n.tipo,
            descripcion: n.descripcion,
            fecha: reporteConDatos.fechaGenerado,
          })) || [];
        
          const capacitaciones = reporteConDatos.capacitaciones?.map((c) => ({
            tipo: "capacitacion",
            titulo: c.nombre,
            descripcion: c.descripcion,
            fecha: reporteConDatos.fechaGenerado,
          })) || [];
        
          const allItems = [...necesidades, ...capacitaciones];
          console.log("Items procesados:", allItems);
          setItems(allItems);
        } else {
          console.log("No se encontraron reportes con datos");
          setItems([{
            tipo: "informacion",
            titulo: "Formulario Pendiente",
            descripcion: "Por favor complete el formulario enviado a su correo",
            fecha: new Date().toISOString()
          }]);
        }
      } else {
        console.log("No se encontraron reportes");
        setItems([{
          tipo: "informacion",
          titulo: "Formulario Pendiente",
          descripcion: "Por favor complete el formulario enviado a su correo",
          fecha: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error("Error cargando necesidades/capacitaciones:", error);
      setItems([{
        tipo: "error",
        titulo: "Error",
        descripcion: "No se pudieron cargar los datos. Intente nuevamente más tarde.",
        fecha: new Date().toISOString()
      }]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hayFiltrosActivos = filtrosAplicados.tipo !== null || filtrosAplicados.desde || filtrosAplicados.hasta;

  // Mover las animaciones a useEffect
  useEffect(() => {
    if (hayFiltrosActivos) {
      Animated.parallel([
        Animated.timing(reiniciarOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(searchWidthAnim, { toValue: 0.75, duration: 300, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(reiniciarOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(searchWidthAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
      ]).start();
    }
  }, [hayFiltrosActivos]);

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
    setFiltrosAplicados({ tipo: null, desde: null, hasta: null });
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

  const filtrados = items.filter(e => {
    const tipo = filtrosAplicados.tipo;
    const desde = filtrosAplicados.desde;
    const hasta = filtrosAplicados.hasta;

    // Filtro por tipo
    if (tipo && e.tipo !== tipo) return false;

    // Filtro por fechas - mejorado
    if (desde || hasta) {
      const fecha = new Date(e.fecha);
      if (isNaN(fecha.getTime())) {
        console.warn("Fecha inválida encontrada:", e.fecha);
        return false;
      }
      
      if (desde) {
        const fechaDesde = new Date(desde);
        fechaDesde.setHours(0, 0, 0, 0);
        if (fecha < fechaDesde) return false;
      }
      
      if (hasta) {
        const fechaHasta = new Date(hasta);
        fechaHasta.setHours(23, 59, 59, 999);
        if (fecha > fechaHasta) return false;
      }
    }

    // Filtro por búsqueda
    if (search.length > 0 && !e.titulo.toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.verdeOscuro} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Necesidades y Capacitaciones</Text>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity onPress={abrirPanel} style={[styles.filtroButton, { backgroundColor: hayFiltrosActivos ? colors.verdeOscuro : colors.fondo }]}>
          <FontAwesome5 name="filter" size={18} color={hayFiltrosActivos ? colors.white : colors.verdeOscuro} />
        </TouchableOpacity>

        <Animated.View style={{ flex: searchWidthAnim }}>
          <TextInput
            placeholder="Buscar necesidad o capacitación..."
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
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {items.length === 0 ? 
                "No hay necesidades o capacitaciones disponibles." : 
                "No se encontraron resultados.\nPresione la X para reiniciar los filtros."
              }
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardSubtitle}>{item.descripcion}</Text>
            <Text style={styles.cardFecha}>
              Fecha: {item.fecha ? new Date(item.fecha).toLocaleDateString() : 'Fecha no disponible'}
            </Text>
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
              {["necesidad", "capacitacion"].map(tipo => (
                <Pressable
                  key={tipo}
                  style={[styles.choiceChip, filtrosTemp.tipo === tipo && styles.choiceChipSelected]}
                  onPress={() => setFiltrosTemp(prev => ({ ...prev, tipo }))}
                >
                  <Text style={{ color: filtrosTemp.tipo === tipo ? colors.white : colors.dark }}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</Text>
                </Pressable>
              ))}
            </View>

            <TouchableOpacity onPress={() => setMostrarRangoFechas(!mostrarRangoFechas)} style={styles.rangoFechaToggle}>
              <Text style={{ color: colors.darkBlue, fontWeight: 'bold' }}>Rango de Fechas</Text>
              <Ionicons name={mostrarRangoFechas ? "chevron-up" : "chevron-down"} size={20} color={colors.darkBlue} />
            </TouchableOpacity>

            {mostrarRangoFechas && (
              <>
                <TouchableOpacity onPress={() => abrirPicker("Desde")} style={styles.datePicker}>
                  <Text>Desde: {filtrosTemp.desde ? filtrosTemp.desde.toLocaleDateString() : "----"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => abrirPicker("Hasta")} style={styles.datePicker}>
                  <Text>Hasta: {filtrosTemp.hasta ? filtrosTemp.hasta.toLocaleDateString() : "----"}</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={aplicarFiltros} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

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