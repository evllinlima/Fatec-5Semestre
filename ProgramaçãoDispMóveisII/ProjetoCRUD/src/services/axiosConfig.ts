import axios, { AxiosInstance } from 'axios';

/**
 * Configuração centralizadade Axios com timeout e tratamento de erros
 */

// Detectar o IP da API baseado no ambiente
const getAPIBaseURL = (): string => {
  // Suporte para variáveis de ambiente (se usar .env)
  // const envURL = process.env.REACT_APP_API_URL;
  // if (envURL) return envURL;

  // Para desenvolvimento local, tente localhost primeiro
  // Em produção, configure via variável de ambiente
  return 'http://192.168.1.100:3001/api'; // Ajuste conforme sua rede
};

const API_BASE_URL = getAPIBaseURL();

// Criar instância do axios com configuração padrão
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em requisições
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage?.getItem?.('authToken') || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erro ao preparar requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros de resposta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout na requisição — a API não respondeu em tempo hábil');
      return Promise.reject(new Error('Timeout: A API não está respondendo. Verifique se está rodando.'));
    }

    if (error.message === 'Network Error') {
      console.error('Erro de rede — não foi possível conectar à API');
      return Promise.reject(new Error('Erro de rede: Verifique se a API está rodando e acessível.'));
    }

    if (error.response?.status === 401) {
      console.error('Não autorizado — token inválido ou expirado');
      return Promise.reject(new Error('Não autorizado: Faça login novamente.'));
    }

    if (error.response?.status === 404) {
      console.error('Recurso não encontrado');
      return Promise.reject(new Error('Recurso não encontrado.'));
    }

    console.error('Erro da API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const API_BASE_URL_CONST = API_BASE_URL;

export default axiosInstance;
