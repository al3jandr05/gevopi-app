import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    Pressable,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/detalleSolicitudStyles';
import colors from '../themes/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import voluntariosData from '../components/voluntarios';
import { actualizarSolicitudEnProgreso } from '../services/mutationsNOSQL';

export default function DetalleSolicitudScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { solicitud: solicitudInicial } = route.params;

    const [solicitud, setSolicitud] = useState(solicitudInicial);
    const [modalVisible, setModalVisible] = useState(false);
    const [voluntariosAsignados, setVoluntariosAsignados] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
    const [contadorActivo, setContadorActivo] = useState(false);
    const [segundosRestantes, setSegundosRestantes] = useState(0);

    // Filtrar voluntarios disponibles (no asignados)
    const voluntariosDisponibles = voluntariosData.filter(
        v => !voluntariosAsignados.some(va => va.ci === v.ci)
    );

    // Filtrar según búsqueda
    const voluntariosFiltrados = busqueda
        ? voluntariosDisponibles.filter(
            v =>
                v.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                v.ci.toString().includes(busqueda)
        )
        : voluntariosDisponibles;

    // Efecto para el contador
    useEffect(() => {
        let intervalo;
        if (contadorActivo && segundosRestantes > 0) {
            intervalo = setInterval(() => {
                setSegundosRestantes(prev => prev - 1);
            }, 1000);
        } else if (segundosRestantes === 0 && contadorActivo) {
            setContadorActivo(false);
            setSolicitud(prev => ({
                ...prev,
                estado: 'Resuelto',
            }));
        }
        return () => clearInterval(intervalo);
    }, [contadorActivo, segundosRestantes]);

    const agregarVoluntario = (vol) => {
        if (voluntariosAsignados.length >= 5) {
            alert('Máximo 5 voluntarios permitidos');
            return;
        }
        if (voluntariosAsignados.some(v => v.ci === vol.ci)) return;
        setVoluntariosAsignados(prev => [...prev, vol]);
        setBusqueda('');
        setMostrarBusqueda(false);
    };

    const quitarVoluntario = (ci) => {
        setVoluntariosAsignados(prev => prev.filter(v => v.ci !== ci));
    };

    const confirmarAsignacion = async () => {
        if (voluntariosAsignados.length === 0) {
            alert('Debe asignar al menos un voluntario');
            return;
        }

        // Convertir CI a números enteros
        const ciArray = voluntariosAsignados.map(v => parseInt(v.ci, 10));

        try {
            // Actualizar en la base de datos
            const resultado = await actualizarSolicitudEnProgreso(solicitud.id, ciArray);

            if (resultado) {
                // Actualizar estado local
                setSolicitud(prev => ({
                    ...prev,
                    estado: 'En progreso',
                    ciVoluntariosAcudir: ciArray,
                }));

                // Iniciar contador aleatorio (10-20 segundos)
                const segundos = Math.floor(Math.random() * 11) + 10;
                setSegundosRestantes(segundos);
                setContadorActivo(true);
            }
        } catch (err) {
            alert('Error al actualizar la solicitud');
            console.error(err);
        }
    };

    const cancelarSolicitud = async () => {
        try {
            // Actualizar en la base de datos (volver a "Sin responder")
            await actualizarSolicitudEnProgreso(solicitud.id, []);

            // Actualizar estado local
            setSolicitud(prev => ({
                ...prev,
                estado: 'Sin responder',
                ciVoluntariosAcudir: [],
            }));
            setVoluntariosAsignados([]);
            setContadorActivo(false);
        } catch (err) {
            alert('Error al cancelar la solicitud');
            console.error(err);
        }
    };

    return (
        <View style={styles.container}>
            {/* Botón de volver */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <MaterialIcons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: parseFloat(solicitud.latitud),
                    longitude: parseFloat(solicitud.longitud),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: parseFloat(solicitud.latitud),
                        longitude: parseFloat(solicitud.longitud),
                    }}
                    title="Ubicación"
                    description={solicitud.descripcion}
                />
            </MapView>

            <TouchableOpacity
                style={styles.bottomButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.bottomButtonText}>Ver Información</Text>
            </TouchableOpacity>

            {/* Modal Principal */}
            <Modal transparent visible={modalVisible} animationType="fade">
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setModalVisible(false)}
                />
                <View style={styles.modalContent}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <FontAwesome5 name="times" size={20} color={colors.verdeOscuro} />
                    </TouchableOpacity>

                    <Text style={styles.modalTitle}>Detalles de la Solicitud</Text>

                    <ScrollView>
                        <View style={styles.infoRow}>
                            <FontAwesome5 name="file-alt" size={18} color={colors.verdeOscuro} />
                            <Text style={styles.infoText}>{solicitud.descripcion}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <FontAwesome5 name="calendar" size={18} color={colors.verdeOscuro} />
                            <Text style={styles.infoText}>
                                {new Date(solicitud.fecha).toLocaleString()}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <FontAwesome5 name="heartbeat" size={18} color={colors.verdeOscuro} />
                            <Text style={styles.infoText}>Tipo: {solicitud.tipo}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <FontAwesome5
                                name="exclamation-triangle"
                                size={18}
                                color={colors.verdeOscuro}
                            />
                            <Text style={styles.infoText}>Nivel: {solicitud.nivelEmergencia}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <FontAwesome5
                                name="check-circle"
                                size={18}
                                color={colors.verdeOscuro}
                            />
                            <Text style={styles.infoText}>Estado: {solicitud.estado}</Text>
                        </View>

                        {solicitud.estado === 'En progreso' && (
                            <Text style={[styles.infoText, { textAlign: 'center', marginTop: 10 }]}>
                                Tiempo restante: {segundosRestantes} segundos
                            </Text>
                        )}

                        {solicitud.estado === 'Sin responder' && (
                            <>
                                <Text style={styles.modalTitle}>Asignar Voluntarios</Text>

                                {voluntariosAsignados.length > 0 && (
                                    <View style={styles.voluntariosAsignadosContainer}>
                                        <Text style={styles.contadorVoluntarios}>
                                        </Text>
                                        {voluntariosAsignados.map((v) => (
                                            <View key={v.ci} style={styles.voluntarioSeleccionado}>
                                                <Text style={styles.voluntarioText}>{v.nombre} - CI: {v.ci}</Text>
                                                <TouchableOpacity onPress={() => quitarVoluntario(v.ci)}>
                                                    <Ionicons name="close-circle" size={20} color={colors.red} />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {!mostrarBusqueda ? (
                                    <TouchableOpacity
                                        style={styles.agregarVoluntarioBtn}
                                        onPress={() => setMostrarBusqueda(true)}
                                    >
                                        <Text style={styles.agregarVoluntarioText}>+ Agregar voluntario</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.busquedaContainer}>
                                        <TextInput
                                            placeholder="Buscar por CI o nombre"
                                            style={styles.input}
                                            value={busqueda}
                                            onChangeText={setBusqueda}
                                            autoFocus={true}
                                        />

                                        <ScrollView style={styles.listaVoluntarios}>
                                            {voluntariosFiltrados.length > 0 ? (
                                                voluntariosFiltrados.map((v) => (
                                                    <TouchableOpacity
                                                        key={v.ci}
                                                        style={styles.voluntarioItem}
                                                        onPress={() => agregarVoluntario(v)}
                                                    >
                                                        <Text style={styles.voluntarioNombre}>
                                                            {v.nombre} - CI: {v.ci}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))
                                            ) : (
                                                <Text style={styles.sinResultados}>
                                                    No se encontraron voluntarios
                                                </Text>
                                            )}
                                        </ScrollView>
                                    </View>
                                )}

                                <TouchableOpacity
                                    style={[
                                        styles.accionButton,
                                        voluntariosAsignados.length === 0 && styles.accionButtonDisabled
                                    ]}
                                    onPress={confirmarAsignacion}
                                    disabled={voluntariosAsignados.length === 0}
                                >
                                    <Text style={styles.accionButtonText}>
                                        {voluntariosAsignados.length > 0
                                            ? `Aceptar Asignaciones (${voluntariosAsignados.length}/5)`
                                            : 'Asignar voluntarios'}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {solicitud.estado === 'En progreso' && (
                            <TouchableOpacity
                                style={[styles.accionButton, { backgroundColor: colors.red }]}
                                onPress={cancelarSolicitud}
                            >
                                <Text style={styles.accionButtonText}>Cancelar Solicitud</Text>
                            </TouchableOpacity>
                        )}

                        {solicitud.estado === 'Resuelto' && solicitud.ciVoluntariosAcudir?.length > 0 && (
                            <>
                                <Text style={styles.sectionTitle}>Voluntarios Asignados</Text>
                                {solicitud.ciVoluntariosAcudir.map((ci, i) => {
                                    const voluntario = voluntariosData.find(v => v.ci === ci);
                                    return (
                                        <View key={i} style={styles.voluntarioSeleccionado}>
                                            <Text style={styles.voluntarioText}>
                                                {voluntario ? `${voluntario.nombre} - CI: ${ci}` : `CI: ${ci}`}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </>
                        )}
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.closeActionButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeActionButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}