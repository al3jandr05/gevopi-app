import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://34.9.138.238:8000',
  baseURL: 'http://192.168.0.10:8000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
