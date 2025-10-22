package com.fitclass.academia_api.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fitclass.academia_api.DTO.UpdateUsuarioDTO;
import com.fitclass.academia_api.model.Usuario;
import com.fitclass.academia_api.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public Usuario registrar(Usuario usuario) {
        String senhaCriptografada = passwordEncoder.encode(usuario.getSenha());
        usuario.setSenha(senhaCriptografada);
        return usuarioRepository.save(usuario);
    }

    public Usuario findByLogin(String login) {
        return usuarioRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o login: " + login));
    }


    public Usuario update(String login, UpdateUsuarioDTO dto) {
        Usuario usuario = findByLogin(login);

        if (dto.getNome() != null) {
            usuario.setNome(dto.getNome());
        }


        return usuarioRepository.save(usuario);
    }
}