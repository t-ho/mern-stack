import axios from 'axios';

const mernApi = axios.create({
  baseURL: 'http://2cfb9afa.ngrok.io/api'
});

mernApi.setAuthToken = jwtToken => {
  mernApi.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
};

export default mernApi;
