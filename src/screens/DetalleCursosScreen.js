import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ProgressBarAndroid, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../themes/colors';
import styles from '../styles/detalleCursosStyles'; // We will create this file

export default function DetalleCursosScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { curso: initialCourse } = route.params;

  // State to manage the course details, especially for updating stage completion
  const [curso, setCurso] = useState(initialCourse);

  // Check if all stages are completed to enable the "Finalizar Curso" button
  const allStagesCompleted = curso.stages.every(stage => stage.completed);

  // Function to mark a stage as completed
  const handleCompleteStage = (stageId) => {
    // Find the index of the current stage
    const currentStageIndex = curso.stages.findIndex(s => s.id === stageId);

    // If the current stage is not the first, check if the previous stage is completed
    if (currentStageIndex > 0 && !curso.stages[currentStageIndex - 1].completed) {
      Alert.alert(
        'Etapa Anterior Incompleta',
        'Por favor, completa la etapa anterior antes de avanzar.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Mark the current stage as completed
    const updatedStages = curso.stages.map(stage =>
      stage.id === stageId ? { ...stage, completed: true } : stage
    );

    // Update course status and progress if applicable
    let newEstado = curso.estado;
    let newProgreso = Math.floor((updatedStages.filter(s => s.completed).length / updatedStages.length) * 100);

    if (newProgreso === 100) {
      newEstado = 'Finalizado';
    } else if (newProgreso > 0 && newProgreso < 100) {
      newEstado = 'En progreso';
    } else {
      newEstado = 'Sin empezar'; // Should only happen if no stages are completed
    }

    setCurso(prevCurso => ({
      ...prevCurso,
      stages: updatedStages,
      estado: newEstado,
      progreso: newProgreso,
    }));

    // In a real application, you would send this update to your backend here.
    // Example: saveCourseProgress(curso.id, updatedStages, newEstado, newProgreso);
  };

  // Function to finalize the course
  const handleFinalizeCourse = () => {
    if (allStagesCompleted) {
      // Logic to mark the course as completely finished in your backend
      // This might involve updating the course's status to 'Finalizado' if it's not already
      Alert.alert(
        'Curso Finalizado',
        `¡Has completado el curso "${curso.titulo}" con éxito!`,
        [{ text: 'OK' }]
      );
      // You might want to navigate back or update the course list here
      navigation.goBack(); // Or navigate to a 'CursosCompletados' screen
    } else {
      Alert.alert(
        'Etapas Incompletas',
        'Debes completar todas las etapas antes de finalizar el curso.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.naranjaFuerte} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Curso</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.courseDetailsCard}>
          <Text style={styles.courseTitle}>{curso.titulo}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <Text style={styles.infoValue}>{curso.estado}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Progreso:</Text>
            <Text style={styles.infoValue}>{curso.progreso}%</Text>
          </View>
          {Platform.OS === 'android' ? (
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={curso.progreso / 100}
              color={colors.naranjaFuerte}
              style={styles.progressBar}
            />
          ) : (
            <View style={styles.progressBariOS}>
              <View style={[styles.progressBarFilliOS, { width: `${curso.progreso}%` }]} />
            </View>
          )}

        </View>


        <View style={styles.progressContainer}>
          <Text style={styles.progressSectionTitle}>Etapas del Curso</Text>
          {curso.stages.map((stage, index) => (
            <View key={stage.id} style={styles.stepWrapper}>
              <View style={styles.stepLineContainer}>
                <View style={[styles.stepCircle, stage.completed && styles.stepCircleCompleted]}>
                  {stage.completed ? (
                    <Ionicons name="checkmark-sharp" size={18} color={colors.blanco} />
                  ) : (
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  )}
                </View>
                {index < curso.stages.length - 1 && (
                  <View style={[styles.stepLine, stage.completed && styles.stepLineCompleted]} />
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.stepContent,
                  stage.completed && styles.stepContentCompleted,
                  !stage.completed && index > 0 && !curso.stages[index - 1].completed && styles.stepContentDisabled // Disable if previous is not completed
                ]}
                onPress={() => handleCompleteStage(stage.id)}
                disabled={stage.completed || (index > 0 && !curso.stages[index - 1].completed)} // Disable if completed or previous is not completed
              >
                <View style={styles.stepTextContainer}>
                  <Text style={[styles.stepTitle, stage.completed && styles.stepTitleCompleted]}>
                    {stage.title}
                  </Text>
                  <Text style={[styles.stepDescription, stage.completed && styles.stepDescriptionCompleted]}>
                    {stage.description}
                  </Text>
                </View>
                {!stage.completed && (
                  <FontAwesome5 name="chevron-right" size={14} color={colors.gray} />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.finishButton, !allStagesCompleted && styles.finishButtonDisabled]}
          onPress={handleFinalizeCourse}
          disabled={!allStagesCompleted}
        >
          <Text style={[styles.finishButtonText, !allStagesCompleted && styles.finishButtonTextDisabled]}>Finalizar Curso</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}