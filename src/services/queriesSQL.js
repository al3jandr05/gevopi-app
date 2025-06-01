import client from './apiSQL';
import { gql } from '@apollo/client';

export const obtenerReportePorVoluntarioId = async (id) => {
  const { data } = await client.query({
    query: gql`
      query {
        reportesVoluntarios(historialId: ${id}) {
          estadoGeneral
          resumenFisico
          resumenEmocional
          recomendaciones
          observaciones
          fechaGenerado
          necesidades {
            tipo
            descripcion
          }
          capacitaciones {
            nombre
            descripcion
          }
        }
      }
    `,
  });
  return data.reportesVoluntarios;
};

export const GET_EVALUACIONES = gql`
  query GetEvaluaciones($historialId: Int!) {
    evaluacionesVoluntarios(historialId: $historialId) {
      id
      fecha
      respuestas {
        id
        respuestaTexto
        textoPregunta
        pregunta {
          id
          texto
          tipo
        }
      }
      test {
        id
        nombre
        descripcion
        categoria
        preguntas {
          id
          texto
          tipo
        }
      }
    }
  }
`;

export const obtenerDatosCarrusel = async (voluntarioId) => {
  try {
    const { data } = await client.query({
      query: gql`
        query ObtenerDatosCarrusel($voluntarioId: Int!) {
          reportesPorVoluntario(voluntarioId: $voluntarioId, sort: "fechaGenerado:desc") {
            id
            observaciones
            resumenFisico
            resumenEmocional
            necesidades {
              id
              tipo
              descripcion
            }
            capacitaciones {
              id
              nombre
              descripcion
            }
            fechaGenerado
          }
        }
      `,
      variables: { voluntarioId: parseInt(voluntarioId) },
      fetchPolicy: 'network-only'
    });

    const reportes = data?.reportesPorVoluntario || [];
    const reporteActivo = reportes.find(r => r.observaciones?.trim()) || reportes[0];
    
    return {
      necesidades: reporteActivo?.necesidades || [],
      capacitaciones: reporteActivo?.capacitaciones || [],
      resumenFisico: reporteActivo?.resumenFisico,
      resumenEmocional: reporteActivo?.resumenEmocional,
      tieneDatos: !!reporteActivo,
      fecha: reporteActivo?.fechaGenerado
    };
  } catch (error) {
    console.error("Error en obtenerDatosCarrusel:", error);
    return {
      necesidades: [],
      capacitaciones: [],
      resumenFisico: null,
      resumenEmocional: null,
      tieneDatos: false,
      fecha: null
    };
  }
};