package com.fitclass.academia_api.config;

import com.fitclass.academia_api.repository.UsuarioRepository;
import com.fitclass.academia_api.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UsuarioRepository usuarioRepository;

    public SecurityConfig(@Lazy JwtAuthFilter jwtAuthFilter, UsuarioRepository usuarioRepository) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.usuarioRepository = usuarioRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/alunos").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/aulas/instrutor/me").hasAuthority("INSTRUTOR")
                        .requestMatchers(HttpMethod.GET, "/api/agendamentos/aula/{aulaId}").hasAuthority("INSTRUTOR")
                        .requestMatchers(HttpMethod.POST, "/api/agendamentos/{agendamentoId}/presenca")
                        .hasAuthority("INSTRUTOR")

                        .requestMatchers(HttpMethod.GET, "/api/agendamentos/meus-proximos").hasAuthority("ALUNO")
                        .requestMatchers(HttpMethod.GET, "/api/agendamentos/{id}").hasAuthority("ALUNO")
                        .requestMatchers(HttpMethod.DELETE, "/api/agendamentos/me/{agendamentoId}")
                        .hasAuthority("ALUNO")
                        .requestMatchers(HttpMethod.POST, "/api/agendamentos").hasAuthority("ALUNO")

                        .requestMatchers(HttpMethod.GET, "/api/usuarios/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/aulas/**").authenticated()

                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> usuarioRepository.findByLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}