import axios from 'axios';

const graphqlApi = axios.create({
<<<<<<< Updated upstream
  baseURL: 'http://192.168.0.5:9090/graphql',
=======
  //baseURL: 'http://10.26.4.122:9090/graphql',
  baseURL: 'http://34.9.138.238:9090/graphql',
>>>>>>> Stashed changes
  headers: {
    'Content-Type': 'application/json',
  },
});

export default graphqlApi;
