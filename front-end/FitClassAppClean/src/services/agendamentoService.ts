import api from "./api";
import { Aula } from "./aulaService";
import { Usuario } from "./usuarioService";

export type Agendamento = {
  id: number;
  aula: Aula;
  aluno: Usuario;
  compareceu: boolean;
  status: string;
  dataAgendamento: string;
};

export const getMinhasProximasAulas = async (): Promise<Agendamento[]> => {
  const response = await api.get<Agendamento[]>("/agendamentos/meus-proximos");
  return response.data;
};

export const agendarAula = async (aulaId: number): Promise<Agendamento> => {
  const response = await api.post<Agendamento>("/agendamentos", { aulaId });
  return response.data;
};

export const getAlunosDaAula = async (
  aulaId: number
): Promise<Agendamento[]> => {
  const response = await api.get<Agendamento[]>(`/agendamentos/aula/${aulaId}`);
  return response.data;
};

export const marcarPresenca = async (
  agendamentoId: number,
  compareceu: boolean
): Promise<Agendamento> => {
  const response = await api.post<Agendamento>(
    `/agendamentos/${agendamentoId}/presenca`,
    { compareceu }
  );
  return response.data;
};

export const getAgendamentoById = async (
  agendamentoId: number
): Promise<Agendamento> => {
  const response = await api.get<Agendamento>(`/agendamentos/${agendamentoId}`);
  return response.data;
};

export const cancelarAgendamento = async (
  agendamentoId: number
): Promise<void> => {
  await api.delete(`/agendamentos/me/${agendamentoId}`);
};
