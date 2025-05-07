import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/incendios_mitigadosStyles';
import colors from '../themes/colors';

const IncendiosMitigadosScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const reiniciarOpacity = useRef(new Animated.Value(0)).current;
  const searchWidthAnim = useRef(new Animated.Value(1)).current;

  const incendios = [
    { titulo: "Incendio en Pampa Grande", fecha: "12/03/2025", lugar: "Santa Cruz" },
    { titulo: "Fuego en Samaipata", fecha: "06/02/2025", lugar: "Samaipata" },
    { titulo: "Bosques de Cotoca", fecha: "21/01/2025", lugar: "Cotoca" },
    { titulo: "Incendio Río Grande", fecha: "18/01/2025", lugar: "Río Grande" },
    { titulo: "Zona Sur - Equipetrol", fecha: "10/01/2025", lugar: "Santa Cruz" },
  ];

  const filtrados = incendios.filter(item => 
    item.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const onChangeSearch = (text) => {
    setSearch(text);

    if (text.length > 0) {
      Animated.parallel([
        Animated.timing(reiniciarOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(searchWidthAnim, { toValue: 0.8, duration: 300, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(reiniciarOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(searchWidthAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
      ]).start();
    }
  };

  const limpiarBusqueda = () => {
    setSearch('');
    Animated.parallel([
      Animated.timing(reiniciarOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(searchWidthAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Incendios Mitigados</Text>
      </View>

      <View style={styles.filtersRow}>
        <Animated.View style={{ flex: searchWidthAnim }}>
          <TextInput
            placeholder="Buscar incendio..."
            value={search}
            onChangeText={onChangeSearch}
            style={styles.input}
            placeholderTextColor={colors.darkBlue}
          />
        </Animated.View>

        <Animated.View style={{ opacity: reiniciarOpacity }}>
          <TouchableOpacity onPress={limpiarBusqueda} style={styles.reiniciarButton}>
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
              No se encontraron resultados.{"\n"}Presione la X para reiniciar la búsqueda.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardSubtitle}>Fecha: {item.fecha}</Text>
            <Text style={styles.cardSubtitle}>Lugar: {item.lugar}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default IncendiosMitigadosScreen;
