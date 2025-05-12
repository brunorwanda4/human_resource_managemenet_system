import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3008',
  withCredentials: true,
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;