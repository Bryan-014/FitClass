package com.fitclass.academia_api.service;

import com.fitclass.academia_api.model.Agendamento;
import com.fitclass.academia_api.model.Aula;
import com.fitclass.academia_api.model.Usuario;
import com.fitclass.academia_api.repository.AgendamentoRepository;
import com.fitclass.academia_api.repository.AulaRepository;
import com.fitclass.academia_api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final AulaRepository aulaRepository;
    private final UsuarioRepository usuarioRepository;

    public Agendamento criarAgendamento(Long aulaId, String loginAluno) {

        Usuario aluno = usuarioRepository.findByLogin(loginAluno)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Aula aula = aulaRepository.findById(aulaId)
                .orElseThrow(() -> new RuntimeException("Aula não encontrada"));

        if (agendamentoRepository.findByAlunoIdAndAulaId(aluno.getId(), aula.getId()).isPresent()) {
            throw new RuntimeException("Você já está inscrito nesta aula.");
        }

        Agendamento novoAgendamento = new Agendamento();
        novoAgendamento.setAluno(aluno);
        novoAgendamento.setAula(aula);
        novoAgendamento.setStatus("CONFIRMADO");
        novoAgendamento.setCompareceu(false);
        novoAgendamento.setDataAgendamento(LocalDateTime.now());

        return agendamentoRepository.save(novoAgendamento);
    }

    public List<Agendamento> buscarProximosAgendamentos(String loginAluno) {
        Usuario aluno = usuarioRepository.findByLogin(loginAluno)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        return agendamentoRepository.findByAluno_Id(aluno.getId());
    }

    public Optional<Agendamento> buscarPorId(Long id) {
        return agendamentoRepository.findById(id);
    }

    public List<Agendamento> buscarPorAulaId(Long aulaId) {
        System.out.println("--- [LOG DE SERVIÇO: AgendamentoService] ---");
        System.out.println("Método 'buscarPorAulaId' foi chamado.");
        System.out.println("Buscando agendamentos para o ID da Aula: " + aulaId);

        List<Agendamento> agendamentosEncontrados;
        try {
            agendamentosEncontrados = agendamentoRepository.findByAula_Id(aulaId);
        } catch (Exception e) {
            System.err.println("ERRO ao executar a query findByAula_Id: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }

        if (agendamentosEncontrados.isEmpty()) {
            System.out.println("Resultado: Nenhum agendamento foi encontrado para esta aula.");
        } else {
            System.out.println("Resultado: " + agendamentosEncontrados.size() + " agendamento(s) encontrado(s).");
            for (Agendamento ag : agendamentosEncontrados) {
                System.out.println("  -> Agendamento ID: " + ag.getId() + ", Aluno ID: " + ag.getAluno().getId());
            }
        }
        System.out.println("---------------------------------------------");
        return agendamentosEncontrados;
    }

    public Agendamento marcarPresenca(Long agendamentoId, boolean compareceu) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        agendamento.setCompareceu(compareceu);

        if (!compareceu) {
            agendamento.setStatus("AUSENTE");
        }

        return agendamentoRepository.save(agendamento);
    }

    public void cancelarAgendamentoAluno(Long agendamentoId, String loginAluno) {
        Usuario aluno = usuarioRepository.findByLogin(loginAluno)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (!agendamento.getAluno().getId().equals(aluno.getId())) {
            throw new SecurityException("Você não tem permissão para cancelar este agendamento.");
        }

        agendamentoRepository.delete(agendamento);
    }
}