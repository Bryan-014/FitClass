package com.fitclass.academia_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitclass.academia_api.model.Aula;

public interface AulaRepository extends JpaRepository<Aula, Long> {
    
}
