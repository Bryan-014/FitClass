package com.fitclass.academia_api.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitclass.academia_api.model.Agendamento;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    Optional<Agendamento> findByData_agendamentoAndHorario_agendamento(
        LocalDate data_agendamento, 
        LocalTime horario_agendamento
    );
}
