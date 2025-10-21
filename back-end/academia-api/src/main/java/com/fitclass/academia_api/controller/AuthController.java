package com.fitclass.academia_api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.fitclass.academia_api.DTO.AuthenticationRequest;
import com.fitclass.academia_api.DTO.AuthenticationResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitclass.academia_api.model.Usuario;
import com.fitclass.academia_api.security.JwtService;
import com.fitclass.academia_api.service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(UsuarioService usuarioService, AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody Usuario usuario) {
        Usuario usuarioSalvo = usuarioService.registrar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        System.out.println("=== LOGIN ===");
        System.out.println("Tentando fazer login com: " + request.getLogin());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getLogin(),
                        request.getSenha()));

        final Usuario usuario = usuarioService.findByLogin(request.getLogin());
        final String token = jwtService.generateToken(usuario);
        
        System.out.println("✓ Autenticação bem-sucedida!");
        System.out.println("✓ Token gerado: " + token.substring(0, 20) + "...");
        
        return ResponseEntity.ok(new AuthenticationResponse(token));
    }
}