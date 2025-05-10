import axios from 'axios';

const graphqlApi = axios.create({
    baseURL: 'http://192.168.0.8:8080',  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHistorialClinicoPorVoluntario = async (voluntarioId) => {
  const query = `
    query {
      historialPorVoluntario(voluntarioId: ${voluntarioId}) {
        id
        diagnostico
        fecha
        // agrega aquí los campos reales del modelo HistorialClinico
      }
    }
  `;

  const response = await graphqlApi.post('', { query });

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }

  return response.data.data.historialPorVoluntario;
};
