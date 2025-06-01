import api from './api';

let authToken = null;
let loggedCi = null;

export const login = async (ci, contrasena) => {
  try {
    // Convertir CI a número para el backend
    const ciNumber = parseInt(ci, 10);
    if (isNaN(ciNumber)) {
      throw new Error("El CI debe ser un número");
    }

    const response = await api.post('/usuarios/login', {
      ci: ciNumber,
      contrasena,
    });

    authToken = response.data.access_token;
    loggedCi = ci; // Guardamos el CI original (string)
    
    return authToken;
  } catch (error) {
    console.error('Error en login:', {
      request: { ci, contrasena },
      error: error.response?.data || error.message
    });
    throw error;
  }
};


export const getToken = () => authToken;
export const getLoggedCi = () => loggedCi;