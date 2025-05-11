import api from './api';

let authToken = null;
let loggedEmail = null;

export const login = async (email, contrasena) => {
  const response = await api.post('/usuarios/login', {
    email,
    contrasena,
  });
  authToken = response.data.access_token;
  loggedEmail = email;

  return authToken;
};

console.log(loggedEmail)


export const getToken = () => authToken;
export const getLoggedEmail = () => loggedEmail;
