package com.fitclass.academia_api.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fitclass.academia_api.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByLogin(String login);
}