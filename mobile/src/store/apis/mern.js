import axios from 'axios';
import env from 'react-native-config';

if (!env.REACT_NATIVE_API_SERVER_URL) {
  throw new Error('REACT_NATIVE_API_SERVER_URL envVar is missing');
}

if (env.REACT_NATIVE_ENV === 'development') {
  console.log(
    '[mern.js] REACT_NATIVE_API_SERVER_URL =',
    env.REACT_NATIVE_API_SERVER_URL
  );
}

const serverUrl = env.REACT_NATIVE_API_SERVER_URL;

const mernApi = axios.create({
  baseURL: serverUrl,
});

mernApi.setAuthToken = (jwtToken) => {
  mernApi.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
};

export { mernApi, serverUrl };
