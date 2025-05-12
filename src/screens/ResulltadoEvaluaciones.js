import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../styles/resultado_evaluacionesStyles';
import { useNavigation, useRoute } from '@react-navigation/native';

const ResultadoEvaluacionesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const evaluacion = route.params?.evaluacion || {};
  const reporte = route.params?.reporte || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultado de Evaluación</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Detalles */}
        <View style={styles.detalleContainer}>
          <Text style={styles.sectionTitle}>Detalles de la Evaluación</Text>
          <View style={styles.infoDetalle}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Título:</Text>
              <Text style={styles.detailContent}>{evaluacion.titulo || "-"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha realizada:</Text>
              <Text style={styles.detailContent}>{evaluacion.fechaRealizada || "-"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Resultado entregado:</Text>
              <Text style={styles.detailContent}>{evaluacion.fechaResultado || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Informe Detallado */}
        <View style={styles.detalleContainer}>
          <Text style={styles.sectionTitle}>Informe Detallado</Text>

          {reporte?.observaciones && (
            <>
              <Text style={styles.subSectionTitle}>Observaciones</Text>
              {reporte.observaciones.split('\n').map((obs, i) => (
                <View key={`obs-${i}`} style={styles.reportRow}>
                  <Text style={styles.reportBullet}>•</Text>
                  <Text style={styles.reportText}>{obs}</Text>
                </View>
              ))}
            </>
          )}

          {reporte?.recomendaciones && (
            <>
              <Text style={styles.subSectionTitle}>Recomendaciones</Text>
              {reporte.recomendaciones.split('\n').map((rec, i) => (
                <View key={`rec-${i}`} style={styles.reportRow}>
                  <Text style={styles.reportBullet}>•</Text>
                  <Text style={styles.reportText}>{rec}</Text>
                </View>
              ))}
            </>
          )}

          {(!reporte?.observaciones && !reporte?.recomendaciones) && (
            <Text style={styles.reportText}>No hay observaciones ni recomendaciones disponibles.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ResultadoEvaluacionesScreen;
