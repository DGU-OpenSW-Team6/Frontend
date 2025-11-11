import axios from 'axios';

const api = axios.create({
  baseURL: 'http://52.78.81.44:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

