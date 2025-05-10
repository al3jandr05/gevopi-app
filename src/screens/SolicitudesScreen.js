import React, { useEffect, useState } from 'react';
import { Modal, TextInput } from 'react-native';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { obtenerTodasSolicitudes } from '../services/queriesNOSQL';
import { actualizarSolicitudEnProgreso, marcarSolicitudRespondida } from '../services/mutationsNOSQL';
import { getLoggedEmail } from '../services/authService';
import { getVoluntarioByEmail, getVoluntarioById } from '../services/voluntarioService';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import colors from '../themes/colors';
import * as Location from 'expo-location';

const prioridad = { ALTO: 3, MEDIO: 2, BAJO: 1 };

export default function SolicitudesScreen() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [voluntarioNombre, setVoluntarioNombre] = useState('');
  const [modalCIVisible, setModalCIVisible] = useState(false);
  const [ciList, setCIList] = useState(['']);
  const [ciErrors, setCIErrors] = useState([]);

  const agregarCampoCI = () => {
    if (ciList.length < 5) {
      setCIList([...ciList, '']);
      setCIErrors([...ciErrors, false]);
    }
  };
  
  const actualizarCI = (index, value) => {
    const nuevos = [...ciList];
    nuevos[index] = value;
    setCIList(nuevos);
  
    const nuevosErrores = [...ciErrors];
    nuevosErrores[index] = false;
    setCIErrors(nuevosErrores);
  };
  
  const validarYConfirmar = async () => {
    const errores = [];
    let hayError = false;
  
    for (let i = 0; i < ciList.length; i++) {
      const ci = ciList[i];
      if (!ci || isNaN(ci)) {
        errores[i] = true;
        hayError = true;
      } else {
        errores[i] = false;
      }
    }
  
    setCIErrors(errores);
  
    if (hayError) {
      alert('Uno o más CIs son inválidos (deben ser numéricos)');
      return;
    }
  
    try {
      await actualizarSolicitudEnProgreso(selectedSolicitud.id, ciList.map(ci => parseInt(ci)));
      alert('Solicitud marcada como "En progreso"');
      await cargarSolicitudes();
      setSelectedSolicitud(null);
      setModalCIVisible(false);
      setCIList(['']);
      setCIErrors([]);
    } catch (err) {
      console.error('Error al actualizar solicitud:', err);
      alert('Error al marcar como en progreso');
    }
  };
  

  const cargarSolicitudes = async () => {
    try {
      const email = getLoggedEmail();
      const voluntarioActual = await getVoluntarioByEmail(email);
      if (!voluntarioActual) return;

      const todas = await obtenerTodasSolicitudes();
      const propias = todas.filter(s => s.voluntarioId !== voluntarioActual.id.toString());
      const ordenadas = propias.sort((a, b) => prioridad[b.nivelEmergencia] - prioridad[a.nivelEmergencia]);
      setSolicitudes(ordenadas);
    } catch (err) {
      console.error('Error al obtener solicitudes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const manejarAcudirAlLlamado = async (solicitudId) => {
    try {
      const ci = prompt('Ingrese el CI del voluntario que acudirá:');
      if (!ci || isNaN(ci)) {
        alert('CI inválido.');
        return;
      }
      await actualizarSolicitudEnProgreso(solicitudId, parseInt(ci));
      alert('Marcado como "En progreso"');
      await cargarSolicitudes();
      setSelectedSolicitud(null);
    } catch (error) {
      console.error('Error al actualizar solicitud:', error);
      alert('Error al acudir al llamado');
    }
  };

  const manejarLlegadaUbicacion = async (solicitud) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso de ubicación denegado');
        return;
      }
      const ubicacion = await Location.getCurrentPositionAsync({});
      const distancia = calcularDistancia(
        ubicacion.coords.latitude,
        ubicacion.coords.longitude,
        parseFloat(solicitud.latitud),
        parseFloat(solicitud.longitud)
      );
      if (distancia <= 100) {
        await marcarSolicitudRespondida(solicitud.id);
        alert('Solicitud marcada como respondida');
        await cargarSolicitudes();
        setSelectedSolicitud(null);
      } else {
        alert(`Estás a ${Math.round(distancia)} metros. Acércate más.`);
      }
    } catch (err) {
      console.error('Error al verificar ubicación:', err);
      alert('Error verificando ubicación');
    }
  };

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const rad = (x) => (x * Math.PI) / 180;
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const abrirDetalleSolicitud = async (solicitud) => {
    try {
      setSelectedSolicitud(solicitud);
      const voluntario = await getVoluntarioById(parseInt(solicitud.voluntarioId));
      setVoluntarioNombre(`${voluntario.nombre} ${voluntario.apellido}`);
    } catch (err) {
      setVoluntarioNombre('Desconocido');
    }
  };

  const getColorPorNivel = (nivel) => {
    switch (nivel) {
      case 'ALTO': return '#ff4d4d';
      case 'MEDIO': return '#ffcc00';
      case 'BAJO': return '#5cb85c';
      default: return colors.gray;
    }
  };

  const getColorPorEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'sin respuesta': return '#999';
      case 'en progreso': return '#FFA500';
      case 'respondido': return '#28a745';
      default: return '#666';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => abrirDetalleSolicitud(item)}>
      <View style={[styles.card, { borderLeftWidth: 6, borderLeftColor: getColorPorNivel(item.nivelEmergencia) }]}>
        <Text style={styles.title}>{item.tipo} - {item.nivelEmergencia}</Text>
        <Text style={styles.desc}>{item.descripcion}</Text>
        <Text style={styles.info}>Fecha: {new Date(item.fecha).toLocaleString()}</Text>
        <View style={{ height: 150, marginTop: 10, borderRadius: 8, overflow: 'hidden' }}>
          <MapView
            style={{ flex: 1 }}
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
              title="Ubicación de la emergencia"
              description={item.tipo}
            />
          </MapView>
        </View>
        <Text style={[styles.info, {
          fontSize: 16,
          fontWeight: 'bold',
          fontStyle: 'italic',
          color: getColorPorEstado(item.estado),
          marginTop: 4,
        }]}>
          Estado: {item.estado || 'Sin respuesta'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.darkBlue} />
        <Text>Cargando solicitudes...</Text>
      </View>
    );
  }

  if (solicitudes.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: colors.gray, fontSize: 16 }}>
          No hay solicitudes disponibles.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
      {selectedSolicitud && (
        <View style={styles.overlayCard}>
          <View style={styles.overlayHeader}>
            <Text style={styles.overlayTitle}>Solicitud</Text>
            <TouchableOpacity onPress={() => setSelectedSolicitud(null)}>
              <FontAwesome5 name="times" size={18} color={colors.darkBlue} />
            </TouchableOpacity>
          </View>
          <Text style={styles.overlayText}>Tipo: {selectedSolicitud.tipo}</Text>
          <Text style={styles.overlayText}>Descripción: {selectedSolicitud.descripcion}</Text>
          <Text style={styles.overlayText}>Nivel: {selectedSolicitud.nivelEmergencia}</Text>
          <Text style={styles.overlayText}>Estado: {selectedSolicitud.estado}</Text>
          <Text style={styles.overlayText}>Voluntario: {voluntarioNombre}</Text>
          {selectedSolicitud.estado?.toLowerCase() === 'sin responder' && (
            <TouchableOpacity
                style={styles.overlayButton}
                onPress={() => setModalCIVisible(true)}
                >
                <Text style={styles.overlayButtonText}>Acudir al llamado</Text>
            </TouchableOpacity>
            )}

            {selectedSolicitud.estado?.toLowerCase() === 'en progreso' && (
            <TouchableOpacity
                style={[styles.overlayButton, { backgroundColor: colors.green }]}
                onPress={() => manejarLlegadaUbicacion(selectedSolicitud)}
            >
                <Text style={styles.overlayButtonText}>Ya en ubicación</Text>
            </TouchableOpacity>
            )}
        </View>
      )}
      <Modal
        visible={modalCIVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalCIVisible(false)}
        >
        <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>CIs que acudirán (máx 5)</Text>

            {ciList.map((ci, index) => (
                <TextInput
                key={index}
                value={ci}
                onChangeText={(text) => actualizarCI(index, text)}
                placeholder="Ingrese CI"
                keyboardType="numeric"
                style={[
                    styles.modalInput,
                    ciErrors[index] ? { borderColor: 'red' } : {},
                ]}
                />
            ))}

            {ciList.length < 5 && (
                <TouchableOpacity onPress={agregarCampoCI}>
                <Text style={{ color: colors.darkBlue, marginBottom: 10 }}>+ Agregar otro</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.overlayButton} onPress={validarYConfirmar}>
                <Text style={styles.overlayButtonText}>Confirmar</Text>
            </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 14,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: colors.darkBlue,
  },
  desc: {
    marginBottom: 6,
  },
  info: {
    fontSize: 12,
    color: colors.gray,
  },
  overlayCard: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderColor: colors.gray,
    borderWidth: 1,
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  overlayTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.darkBlue,
  },
  overlayText: {
    fontSize: 14,
    marginBottom: 4,
  },
  overlayButton: {
    marginTop: 12,
    backgroundColor: colors.darkBlue,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  overlayButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: colors.darkBlue,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  
});
