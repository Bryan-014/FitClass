import api from './api';

export type Instrutor = {
    id?: number;
    nome: string;
    especialidade: string;
};

export const getInstrutores = async (): Promise<Instrutor[]> => {
    const response = await api.get<Instrutor[]>('/instrutores');
    return response.data;
};

export const getInstrutorById = async (id: number): Promise<Instrutor> => {
    const response = await api.get<Instrutor>(`/instrutores/${ id }`);
    return response.data;
};

export const createInstrutor = async (instrutorData: Omit<Instrutor, 'id'>): Promise<Instrutor> => {
    const response = await api.post<Instrutor>('/instrutores', instrutorData);
    return response.data;
};

export const updateInstrutor = async (id: number, instrutorData: Instrutor): Promise<Instrutor> => {
    const response = await api.put<Instrutor>(`/instrutores/${ id }`, instrutorData);
    return response.data;
};

export const deleteInstrutor = async (id: number): Promise<void> => {
    await api.delete(`/instrutores/${ id }`);
};