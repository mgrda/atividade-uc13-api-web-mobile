import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your API URL
  timeout: 10000,
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Add the authentication token, if necessary
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

export default api;