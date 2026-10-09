import axios from 'axios';

const _envUrl = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = _envUrl ? (_envUrl.endsWith('/api/v1') ? _envUrl : _envUrl.replace(/\/$/, '') + '/api/v1') : 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

let activeRequests = 0;

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    activeRequests++;
    if (activeRequests === 1) {
      window.dispatchEvent(new Event('api_load_start'));
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        ...config.headers
      };
    }
    return config;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      window.dispatchEvent(new Event('api_load_end'));
    }
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests === 0) {
      window.dispatchEvent(new Event('api_load_end'));
    }
    return response;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      window.dispatchEvent(new Event('api_load_end'));
    }
    return Promise.reject(error);
  }
);