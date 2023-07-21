import axios from 'axios';

const ApiManager = axios.create({
    baseURL: 'http://10.16.6.20:8000',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
});

export default ApiManager;
