import api from './api';

export type Aluno = {
  id?: number;
  nome: string;
  penalidade?: string;
};

export const getAlunos = async (): Promise<Aluno[]> => {
  const response = await api.get<Aluno[]>('/alunos');
  return response.data;
};

export const getAlunoById = async (id: number): Promise<Aluno> => {
  const response = await api.get<Aluno>(`/alunos/${ id }`);
  return response.data;
};

export const createAluno = async (alunoData: Omit<Aluno, 'id' | 'penalidade'>): Promise<Aluno> => {
  const response = await api.post<Aluno>('/alunos', alunoData);
  return response.data;
};

export const updateAluno = async (id: number, alunoData: Omit<Aluno, 'penalidade'>): Promise<Aluno> => {
  const response = await api.put<Aluno>(`/alunos/${ id }`, alunoData);
  return response.data;
};

export const deleteAluno = async (id: number): Promise<void> => {
  await api.delete(`/alunos/${ id }`);
};