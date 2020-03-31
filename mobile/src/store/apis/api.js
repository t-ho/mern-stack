import axios from 'axios';
import serverUrl from './server-url';

const mernApi = axios.create({
  baseURL: `${serverUrl}/api`,
});

mernApi.setAuthToken = (jwtToken) => {
  mernApi.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
};

export default mernApi;
