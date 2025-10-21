package com.fitclass.academia_api.model;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "aulas")
@Data
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String descricao;
    
    @Column(name = "data_hora") 
    private LocalDateTime dataHora;
    
    private int duracao;
    private String capacidade;
    private int limiteCancelamentoHoras;
    private LocalDateTime criadoEm;

    @ManyToOne
    @JoinColumn(name = "instrutor_id")
    private Instrutor instrutor;

    @ManyToMany
    private List<Aluno> alunos;
}