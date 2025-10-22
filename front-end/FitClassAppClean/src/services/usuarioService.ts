import api from './api';

export type Usuario = {
    id: number;
    nome: string;
    login: string;
    role: 'ALUNO' | 'INSTRUTOR' | 'ADMIN';
};

export type Agendamento = {
    id: number;
    aulaNome: string;
    instrutorNome: string;
    horario: string;
    status: string;
};

export type UpdateUsuarioData = {
    nome: string;
};


export const getMeuPerfil = async (): Promise<Usuario> => {
    const response = await api.get<Usuario>('/usuarios/me');
    return response.data;
};

export const getMinhasProximasAulas = async (): Promise<Agendamento[]> => {
    const response = await api.get<Agendamento[]>('/agendamentos/meus-proximos');
    return response.data;
};

export const updateMeuPerfil = async (data: UpdateUsuarioData): Promise<Usuario> => {
    const response = await api.put<Usuario>('/usuarios/me', data);
    return response.data;
};