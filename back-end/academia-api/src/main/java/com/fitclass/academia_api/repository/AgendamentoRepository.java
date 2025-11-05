package com.fitclass.academia_api.repository;

import java.util.List;
import com.fitclass.academia_api.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByAluno_Id(Long alunoId);

    Optional<Agendamento> findByAlunoIdAndAulaId(Long alunoId, Long aulaId);

    List<Agendamento> findByAula_Id(Long aulaId);
}