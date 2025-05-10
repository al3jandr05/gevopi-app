import graphqlApi from './apiNOSQL';

export const crearSolicitudAyuda = async ({
  tipo,
  descripcion,
  nivelEmergencia,
  fecha,
  voluntarioId,
  latitud,
  longitud,
}) => {
    const query = `
    mutation {
      crearSolicitudAyuda(
        descripcion: "${descripcion}"
        fecha: "${fecha}"
        nivelEmergencia: ${nivelEmergencia}
        tipo: "${tipo}"
        voluntarioId: "${voluntarioId}"
        latitud: ${latitud}
        longitud: ${longitud}
        estado: "Sin responder"
      ) {
        id
        descripcion
        fecha
        nivelEmergencia
        tipo
        voluntarioId
        latitud
        longitud
        estado
      }
    }
  `;

  const response = await graphqlApi.post('', { query });

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }

  return response.data.data.crearSolicitudAyuda;
};

export const actualizarSolicitudEnProgreso = async (id, ciArray) => {
    const query = `
      mutation {
        actualizarSolicitudEnProgreso(id: "${id}", nuevosCIs: ${JSON.stringify(ciArray)}) {
          id
          estado
          ciVoluntariosAcudir
        }
      }
    `;
  
    const response = await graphqlApi.post('', { query });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data.actualizarSolicitudEnProgreso;
  };
  
  
  export const marcarSolicitudRespondida = async (id) => {
    const query = `
      mutation {
        marcarSolicitudRespondida(id: "${id}") {
          id
          estado
          fechaRespondida
        }
      }
    `;
    const response = await graphqlApi.post('', { query });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data.marcarSolicitudRespondida;
  };