import axios from 'axios';

const ApiManager = axios.create({
  baseURL: `${process.env.API_GATEWAY_URL}`,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
});

export default ApiManager;
