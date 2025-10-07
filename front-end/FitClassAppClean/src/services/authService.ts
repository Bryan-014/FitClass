import api from './api';

interface LoginCredentials {
  login: string;
  senha: string;
}

interface RegisterCredentials {
  nome: string;
  login: string;
  senha: string;
}

export const login = async (credentials: LoginCredentials): Promise<string | null> => {
  try {
    const response = await api.post<string>('/auth/login', credentials);

    const token = response.data;
    console.log('Login bem-sucedido, token recebido!');
    return token;

  } catch (error) {
    console.error('Falha no login:', error);
    return null;
  }
};

export const register = async (credentials: RegisterCredentials) => {
  try {
    const response = await api.post('/auth/register', credentials);
    console.log('Registro bem-sucedido!');
    return response.data;
  } catch (error) {
    console.error('Falha no registro:', error);
    alert('Não foi possível realizar o registro. Verifique os dados ou tente um email diferente.');
    return null;
  }
}