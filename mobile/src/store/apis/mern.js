import axios from 'axios';

const mernApi = axios.create({
  baseURL: 'http://d09f4c85.ngrok.io/api'
});

mernApi.setAuthToken = jwtToken => {
  mernApi.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
};

export default mernApi;
