package com.fitclass.academia_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fitclass.academia_api.model.Instrutor;
import java.util.Optional;

public interface InstrutorRepository extends JpaRepository<Instrutor, Long> {
    Optional<Instrutor> findByUsuario_Login(String login);
}