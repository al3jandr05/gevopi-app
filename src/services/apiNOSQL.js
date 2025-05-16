import axios from 'axios';

const graphqlApi = axios.create({
  baseURL: 'http://10.26.5.61:9090/graphql',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default graphqlApi;
