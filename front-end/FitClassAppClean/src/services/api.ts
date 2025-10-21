import axios from 'axios';
import { getToken } from './tokenService';

const BASE_URL = 'http://192.168.18.4:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Erro da API:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        console.log('Token expirado ou inválido');
      }
    } else if (error.request) {
      console.error('Sem resposta do servidor:', error.message);
    } else {
      console.error('Erro na configuração:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;