import axios from 'axios';

const mernApi = axios.create();

// Set your own baseURL
// mernApi.defaults.baseURL = 'http://localhost:8000';

mernApi.setAuthToken = (jwtToken) => {
  mernApi.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
};

export default mernApi;
