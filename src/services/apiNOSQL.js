import axios from 'axios';

const graphqlApi = axios.create({
  baseURL: 'http://192.168.0.9:9090/graphql', // Cambia por tu IP real
  headers: {
    'Content-Type': 'application/json',
  },
});

export default graphqlApi;
