import axios from 'axios';

const mernApi = axios.create({
  baseURL: 'http://6e055219.ngrok.io/api'
});

mernApi.setAuthToken = jwtToken => {
  mernApi.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
};

export default mernApi;
