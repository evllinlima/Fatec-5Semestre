import axios from 'axios';

// Instância do axios
const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.100:3001', // Ajuste o IP conforme necessário
  timeout: 10000,
});

// Interceptor para adicionar token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skincare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('skincare_token');
      // Redirecionar para login se necessário
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
