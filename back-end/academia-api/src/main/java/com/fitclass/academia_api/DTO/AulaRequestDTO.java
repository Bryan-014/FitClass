package com.fitclass.academia_api.DTO;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class AulaRequestDTO {
    private String nome;
    private String descricao;
    private LocalDateTime dataHora;
    private int duracao;
    private String capacidade;
    private int limiteCancelamentoHoras;
    private Long instrutorId;
}