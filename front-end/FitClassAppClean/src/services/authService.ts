import api from './api';
import { saveToken } from './tokenService';

interface LoginCredentials {
  login: string;
  senha: string;
}

interface RegisterCredentials {
  nome: string;
  login: string;
  senha: string;
}

export const login = async (credentials: LoginCredentials): Promise<string> => {
  try {
    console.log('=== ENVIANDO LOGIN ===');
    console.log('Dados:', credentials);

    const response = await api.post<{ token: string }>('/auth/login', credentials);
    const token = response.data.token;

    await saveToken(token);
    console.log('✓ Login bem-sucedido, token salvo!');

    return token;
  } catch (error: any) {
    console.error('✗ Falha no login:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados do erro:', error.response.data);
    }
    throw error;
  }
};

export const register = async (credentials: RegisterCredentials): Promise<any> => {
  try {
    console.log('=== ENVIANDO REGISTRO ===');
    console.log('Dados:', credentials);

    const response = await api.post('/auth/register', credentials);
    console.log('✓ Registro bem-sucedido!');
    return response.data;
  } catch (error: any) {
    console.error('✗ Falha no registro:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados do erro:', error.response.data);
    }
    throw error;
  }
};