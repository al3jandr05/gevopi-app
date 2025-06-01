import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://34.9.138.238:8000',
  baseURL: 'http://192.168.0.10:8000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

// Interceptor para loggear responses
api.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
}, error => {
  console.error('Error Response:', error);
  return Promise.reject(error);
});


export default api;
