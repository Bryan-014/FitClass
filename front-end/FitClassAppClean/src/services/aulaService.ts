import api from './api';

export type Aula = {
  id?: number;
  nome: string;
  descricao: string;
};

export const getAulas = async (): Promise<Aula[]> => {
  const response = await api.get<Aula[]>('/aulas');
  return response.data;
};

export const getAulaById = async (id: number): Promise<Aula> => {
    const response = await api.get<Aula>(`/aulas/${id}`);
    return response.data;
};

export const createAula = async (aulaData: Omit<Aula, 'id'>): Promise<Aula> => {
  const response = await api.post<Aula>('/aulas', aulaData);
  return response.data;
};

export const updateAula = async (id: number, aulaData: Aula): Promise<Aula> => {
    const response = await api.put<Aula>(`/aulas/${id}`, aulaData);
    return response.data;
};

export const deleteAula = async (id: number): Promise<void> => {
    await api.delete(`/aulas/${id}`);
};