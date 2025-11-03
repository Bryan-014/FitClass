package com.fitclass.academia_api.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fitclass.academia_api.model.Agendamento;
import com.fitclass.academia_api.repository.AgendamentoRepository;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository) {
        this.agendamentoRepository = agendamentoRepository;
    }

    public Optional<Agendamento> buscarPorId(Long id) {
        return agendamentoRepository.findById(id);
    }

    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }

    public Agendamento criarAgendamento(Agendamento agendamento) {
        
        validarNovoAgendamento(agendamento); 

        agendamento.setCompareceu(false); 

        return agendamentoRepository.save(agendamento);
    }
    
    private void validarNovoAgendamento(Agendamento agendamento) {
        
        LocalDate dataAgendamento = agendamento.getData_agendamento();
        LocalTime horarioAgendamento = agendamento.getHorario_agendamento();
        
        LocalDate hoje = LocalDate.now();
        LocalTime agora = LocalTime.now();

        if (dataAgendamento.isBefore(hoje) || 
            (dataAgendamento.isEqual(hoje) && horarioAgendamento.isBefore(agora))) {
            
            throw new RuntimeException("Não é permitido agendar para uma data ou hora no passado.");
        }
        
        Optional<Agendamento> agendamentoExistente = 
            agendamentoRepository.findByData_agendamentoAndHorario_agendamento(
                dataAgendamento, 
                horarioAgendamento
            );

        if (agendamentoExistente.isPresent()) {
            throw new RuntimeException("Já existe um agendamento marcado para esta data e horário. Escolha outro.");
        }
        
        LocalTime horaAbertura = LocalTime.of(6, 0); 
        LocalTime horaFechamento = LocalTime.of(22, 0);

        if (horarioAgendamento.isBefore(horaAbertura) || !horarioAgendamento.isBefore(horaFechamento)) {
            throw new RuntimeException("Agendamento fora do horário de funcionamento da academia (06:00 às 22:00).");
        }
    }


    public void deletarAgendamento(Long id) {
        if (!agendamentoRepository.existsById(id)) {
            throw new RuntimeException("Agendamento não encontrado com o id: " + id);
        }
        agendamentoRepository.deleteById(id);
    }

    public Agendamento atualizarAgendamento(Long id, Agendamento agendamentoDetalhes) {

        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado com o id: " + id));

        agendamento.setCompareceu(agendamentoDetalhes.isCompareceu());
        agendamento.setData_agendamento(agendamentoDetalhes.getData_agendamento());
        agendamento.setHorario_agendamento(agendamentoDetalhes.getHorario_agendamento());
        agendamento.setNotificacao_expira(agendamentoDetalhes.getNotificacao_expira());

        return agendamentoRepository.save(agendamento);
    }
}