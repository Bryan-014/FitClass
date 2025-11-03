package com.fitclass.academia_api.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "agendamentos")
@Data
@NoArgsConstructor
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private boolean compareceu;
    private LocalDate data_agendamento;
    private LocalTime horario_agendamento;
    private LocalDateTime notificacao_expira;

    public Agendamento(Long id, boolean compareceu, LocalDate data_agendamento, LocalTime horario_agendamento,
            LocalDateTime notificacao_expira) {
        this.id = id;
        this.compareceu = compareceu;
        this.data_agendamento = data_agendamento;
        this.horario_agendamento = horario_agendamento;
        this.notificacao_expira = notificacao_expira;
    }
}