import React, { useRef, useCallback, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/detalleSolicitudStyles';
import colors from '../themes/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DetalleSolicitudScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { solicitud } = route.params;
    const bottomSheetRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSheetChanges = useCallback((index) => {
        setIsExpanded(index === 1);
    }, []);

    const toggleBottomSheet = useCallback(() => {
        if (isExpanded) {
            bottomSheetRef.current?.collapse();
        } else {
            bottomSheetRef.current?.expand();
        }
    }, [isExpanded]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
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

                {/* Botón de volver fijo */}
                <TouchableOpacity
                    style={[styles.backButton, { position: 'absolute', top: '8%', left: 20, zIndex: 800 }]}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.verdeOscuro} />
                </TouchableOpacity>

                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={['12%', '30%']}
                    onChange={handleSheetChanges}
                    enablePanDownToClose={false}
                >
                    <TouchableWithoutFeedback onPress={toggleBottomSheet}>
                        <View>
                            <View style={styles.modalPreview}>
                                <Text style={styles.modalTitle}>Detalles de la Solicitud</Text>
                            </View>

                            <ScrollView style={styles.modalContent}>
                                <View>
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
                                </View>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
}