import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.26.15.253:8000', // cambia a la IP de tu máquina y puerto del backend
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
