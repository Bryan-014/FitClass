package com.fitclass.academia_api.model;

import java.security.Timestamp;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity 
@Table(name = "aulas") 
@Data
@Getter
@Setter
public class Aula {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;
    private String nome;
    private String descricao;
    private Timestamp dataHora;
    private int duracao;
    private String capacidade;
    private int limiteCancelamentoHoras;
    private Timestamp criadoEm;

    @ManyToOne 
    @JoinColumn(name = "instrutor_id") 
    private Instrutor instrutor;


    @ManyToMany
    private List<Aluno> alunos;
    
}