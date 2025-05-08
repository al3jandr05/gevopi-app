import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../styles/resultado_evaluacionesStyles';
import { useNavigation, useRoute } from '@react-navigation/native';

const resultadosSimulados = {
  "Evaluación física post-incendio": {
    resumen: "El voluntario presenta una recuperación física favorable.",
    observaciones: [
      "No se detectan lesiones recientes.",
      "Buena movilidad en extremidades.",
      "Signos leves de fatiga muscular."
    ],
    recomendaciones: [
      "Mantener actividad física leve.",
      "Control semanal de signos vitales.",
      "Hidratación adecuada."
    ]
  },
  "Evaluación psicológica inicial": {
    resumen: "Se evidencian síntomas de estrés agudo.",
    observaciones: [
      "Pensamientos intrusivos frecuentes.",
      "Irritabilidad y dificultad para dormir.",
      "Estado de alerta elevado."
    ],
    recomendaciones: [
      "Requiere seguimiento psicológico semanal.",
      "Descanso y disminución de actividades intensas.",
      "Evaluación nuevamente en 1 mes."
    ]
  },
  "Evaluación estrés crónico": {
    resumen: "Se identifican altos niveles de agotamiento mental.",
    observaciones: [
      "Desmotivación y bajo rendimiento.",
      "Síntomas de ansiedad y fatiga constante.",
      "Dificultad para desconectarse del trabajo."
    ],
    recomendaciones: [
      "Suspensión temporal de actividades laborales.",
      "Intervención terapéutica urgente.",
      "Plan de reincorporación progresiva."
    ]
  },
  "Revisión mensual": {
    resumen: "El estado general del voluntario es estable.",
    observaciones: [
      "No se detectan signos de recaída física ni emocional.",
      "Buen estado de ánimo y energía.",
      "Participación activa en las tareas asignadas."
    ],
    recomendaciones: [
      "Mantener rutina actual.",
      "Monitoreo regular sin necesidad de intervención.",
      "Nueva revisión programada en 30 días."
    ]
  },
};

const ResultadoEvaluacionesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const evaluacion = route.params?.evaluacion || {};

  const resultado = resultadosSimulados[evaluacion.titulo] || null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultado de Evaluación</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.sectionTitle}>Detalles de la Evaluación</Text>

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

        <Text style={styles.sectionTitle}>Informe Detallado</Text>

        {resultado ? (
          <>
            <Text style={styles.subSectionTitle}>Resumen General</Text>
            <Text style={styles.reportText}>{resultado.resumen}</Text>

            <Text style={styles.subSectionTitle}>Observaciones</Text>
            {resultado.observaciones.map((obs, i) => (
              <View key={i} style={styles.reportRow}>
                <Text style={styles.reportBullet}>{i + 1}.</Text>
                <Text style={styles.reportText}>{obs}</Text>
              </View>
            ))}

            <Text style={styles.subSectionTitle}>Recomendaciones</Text>
            {resultado.recomendaciones.map((rec, i) => (
              <View key={i} style={styles.reportRow}>
                <Text style={styles.reportBullet}>•</Text>
                <Text style={styles.reportText}>{rec}</Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.reportText}>
            No se encontró un resultado disponible para esta evaluación.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ResultadoEvaluacionesScreen;
