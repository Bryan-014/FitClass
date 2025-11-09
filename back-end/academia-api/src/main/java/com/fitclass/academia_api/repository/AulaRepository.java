package com.fitclass.academia_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.fitclass.academia_api.model.Aula;

public interface AulaRepository extends JpaRepository<Aula, Long> {
    List<Aula> findByInstrutor_Id(Long instrutorId);
}
