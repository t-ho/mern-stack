import axios from 'axios';

const mernApi = axios.create({
  baseURL: 'http://localhost:8080/api'
});

mernApi.setAuthToken = jwtToken => {
  mernApi.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
};

export default mernApi;
