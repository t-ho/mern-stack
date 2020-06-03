import axios from 'axios';

const serverUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_NATIVE_API_SERVER_PROD_URL
    : process.env.REACT_NATIVE_API_SERVER_NGROK_URL;

const mernApi = axios.create({
  baseURL: serverUrl,
});

mernApi.setAuthToken = (jwtToken) => {
  mernApi.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
};

export { mernApi, serverUrl };
