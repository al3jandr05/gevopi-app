import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Animated, Pressable, Modal, Platform } from 'react-native';
import colors from '../themes/colors';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/cursosStyles';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

// Assuming you'll have similar services for courses
// import { useQuery } from '@apollo/client';
// import { getLoggedCi } from '../services/authService';
// import { getVoluntarioByCi } from '../services/voluntarioService';
// import { GET_CURSOS } from '../services/queriesSQL'; 

export default function CursosScreen() {
  const navigation = useNavigation();

  const [search, setSearch] = useState('');
  const [cursos, setCursos] = useState([]); // This will hold your course data

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    estado: null, // 'Finalizado', 'En progreso', 'Sin empezar'
  });

  const [filtrosTemp, setFiltrosTemp] = useState({
    estado: null,
  });

  const [showFilters, setShowFilters] = useState(false);

  const panelAnim = useRef(new Animated.Value(500)).current;
  const reiniciarOpacity = useRef(new Animated.Value(0)).current;
  const searchWidthAnim = useRef(new Animated.Value(1)).current;

  const hayFiltrosActivos = filtrosAplicados.estado !== null;

  // Placeholder for fetching courses
  useEffect(() => {
    // In a real application, you'd fetch courses here, similar to how you fetch evaluations.
    // For now, I'll use dummy data including stages for the detail screen.
    const fetchCursos = async () => {
      const dummyCursos = [
        {
          id: '1',
          titulo: 'Introducción al Voluntariado',
          estado: 'Finalizado',
          progreso: 100,
          fechaInicio: '01/03/2023',
          fechaFin: '15/03/2023',
          stages: [
            { id: 's1', title: 'Registro y Bienvenida', description: 'Primeros pasos como voluntario.', completed: true },
            { id: 's2', title: 'Conoce Nuestra Misión', description: 'Entiende el impacto de tu labor.', completed: true },
            { id: 's3', title: 'Derechos y Deberes', description: 'Información legal y ética del voluntariado.', completed: true },
          ],
        },
        {
          id: '2',
          titulo: 'Primeros Auxilios Básicos',
          estado: 'En progreso',
          progreso: 50,
          fechaInicio: '01/05/2024',
          fechaFin: '30/05/2024',
          stages: [
            { id: 's4', title: 'Evaluación de Escena', description: 'Asegura un entorno seguro para la atención.', completed: true },
            { id: 's5', title: 'RCP (Reanimación Cardiopulmonar)', description: 'Técnicas esenciales para salvar vidas.', completed: false },
            { id: 's6', title: 'Manejo de Heridas', description: 'Cómo tratar cortes, quemaduras y fracturas.', completed: false },
          ],
        },
        {
          id: '3',
          titulo: 'Gestión de Proyectos Comunitarios',
          estado: 'Sin empezar',
          progreso: 0,
          fechaInicio: '01/07/2024',
          fechaFin: '31/07/2024',
          stages: [
            { id: 's7', title: 'Identificación de Necesidades', description: 'Cómo detectar problemas y oportunidades en la comunidad.', completed: false },
            { id: 's8', title: 'Diseño de Proyectos', description: 'Planifica objetivos, actividades y recursos.', completed: false },
            { id: 's9', title: 'Implementación y Evaluación', description: 'Lleva a cabo el proyecto y mide su impacto.', completed: false },
          ],
        },
        {
          id: '4',
          titulo: 'Comunicación Efectiva',
          estado: 'Finalizado',
          progreso: 100,
          fechaInicio: '10/01/2024',
          fechaFin: '20/01/2024',
          stages: [
            { id: 's10', title: 'Escucha Activa', description: 'Mejora tu capacidad de comprender a los demás.', completed: true },
            { id: 's11', title: 'Comunicación No Verbal', description: 'Interpreta y utiliza el lenguaje corporal.', completed: true },
            { id: 's12', title: 'Resolución de Conflictos', description: 'Estrategias para mediar y encontrar soluciones.', completed: true },
          ],
        },
        {
          id: '5',
          titulo: 'Liderazgo y Equipos',
          estado: 'En progreso',
          progreso: 75,
          fechaInicio: '01/06/2024',
          fechaFin: '15/06/2024',
          stages: [
            { id: 's13', title: 'Conceptos de Liderazgo', description: 'Principios fundamentales para guiar a otros.', completed: true },
            { id: 's14', title: 'Formación de Equipos', description: 'Construye grupos cohesivos y productivos.', completed: true },
            { id: 's15', title: 'Motivación y Desempeño', description: 'Impulsa el potencial de tu equipo.', completed: false },
          ],
        },
      ];
      setCursos(dummyCursos);
    };

    fetchCursos();
  }, []);

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
    setFiltrosAplicados({ estado: null });

    Animated.parallel([
      Animated.timing(reiniciarOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(searchWidthAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  if (hayFiltrosActivos) {
    Animated.parallel([
      Animated.timing(reiniciarOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(searchWidthAnim, { toValue: 0.75, duration: 300, useNativeDriver: false }),
    ]).start();
  }

  const filtrados = cursos.filter(curso => {
    const estadoFiltro = filtrosAplicados.estado;

    // Filtro por estado
    if (estadoFiltro && curso.estado !== estadoFiltro) {
      return false;
    }

    // Filtro por búsqueda
    if (search.length > 0 && !curso.titulo.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.naranjaFuerte} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cursos Asignados</Text>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity onPress={abrirPanel} style={[styles.filtroButton, { backgroundColor: hayFiltrosActivos ? colors.naranjaFuerte : colors.fondo }]}>
          <FontAwesome5 name="filter" size={18} color={hayFiltrosActivos ? colors.fondo : colors.naranjaFuerte} />
        </TouchableOpacity>

        <Animated.View style={{ flex: searchWidthAnim }}>
          <TextInput
            placeholder="Buscar curso..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </Animated.View>

        <Animated.View style={{ opacity: reiniciarOpacity }}>
          <TouchableOpacity onPress={reiniciarFiltros} style={styles.reiniciarButton}>
            <Ionicons name="close" size={20} color={colors.blanco} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          let cardBorderColor = colors.verdeCritico; // Default for 'Sin empezar' or general
          if (item.estado === 'Finalizado') {
            cardBorderColor = colors.green; // Example for 'Finalizado'
          } else if (item.estado === 'En progreso') {
            cardBorderColor = colors.yellow; // Example for 'En progreso'
          }

          return (
            <TouchableOpacity
              style={styles.card }
              onPress={() => navigation.navigate('DetalleCursos', { curso: item })} // Corrected navigation
            >
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardSubtitle}>Estado: {item.estado}</Text>
              {item.progreso !== undefined && <Text style={styles.cardSubtitle}>Progreso: {item.progreso}%</Text>}
              {item.fechaInicio && <Text style={styles.cardFecha}>Inicio: {item.fechaInicio}</Text>}
              {item.fechaFin && <Text style={styles.cardFecha}>Fin: {item.fechaFin}</Text>}
              {/* Removed the "Ver detalles" button as the whole card is now pressable */}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.amarillo, textAlign: 'center', fontSize: 16 }}>
              No se encontraron cursos.
            </Text>
          </View>
        )}
      />

      {showFilters && (
        <View style={styles.modalOverlay}>
          <Pressable style={{ flex: 1 }} onPress={cerrarPanel} />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: panelAnim }] }]}>
            <Text style={styles.modalTitle}>Filtros de Cursos</Text>

            <Text style={styles.filterLabel}>Estado del Curso</Text>
            <View style={styles.chipsRow}>
              {['Finalizado', 'En progreso', 'Sin empezar'].map(estado => (
                <Pressable
                  key={estado}
                  style={[styles.choiceChip, filtrosTemp.estado === estado && styles.choiceChipSelected]}
                  onPress={() => setFiltrosTemp(prev => ({
                    ...prev,
                    estado: filtrosTemp.estado === estado ? null : estado
                  }))}
                >
                  <Text style={{ color: filtrosTemp.estado === estado ? colors.blanco : colors.black }}>
                    {estado}
                  </Text>
                </Pressable>
              ))}
            </View>

            <TouchableOpacity onPress={aplicarFiltros} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
}