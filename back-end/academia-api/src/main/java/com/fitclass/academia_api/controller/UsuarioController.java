package com.fitclass.academia_api.controller;

import com.fitclass.academia_api.DTO.UpdateUsuarioDTO;
import com.fitclass.academia_api.model.Usuario;
import com.fitclass.academia_api.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/me")
    public ResponseEntity<Usuario> getMeuPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        Usuario usuario = usuarioService.findByLogin(username);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/me")
    public ResponseEntity<Usuario> updateMeuPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateUsuarioDTO dto) {
        Usuario usuarioAtualizado = usuarioService.update(userDetails.getUsername(), dto);
        return ResponseEntity.ok(usuarioAtualizado);
    }
}