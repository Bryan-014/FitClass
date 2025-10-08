package com.fitclass.academia_api.DTO;

import lombok.Data;
import java.util.List;

@Data
public class AulaRequestDTO {


    private Long instrutorId;

    private List<Long> AlunoId; 
    
    private String nomeAula;
    
}