import axios from 'axios';

const graphqlApi = axios.create({
  baseURL: 'http://192.168.0.5:9090/graphql',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default graphqlApi;
