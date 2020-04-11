import axios from 'axios';

const mernApi = axios.create();

if (process.env.NODE_ENV !== 'production') {
  mernApi.defaults.baseURL = `${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`;
}

mernApi.setAuthToken = (jwtToken) => {
  mernApi.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
};

export default mernApi;
