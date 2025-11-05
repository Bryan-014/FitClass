package com.fitclass.academia_api.config;

import com.fitclass.academia_api.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() 
                        
                        .requestMatchers(HttpMethod.GET, "/api/aulas/instrutor/me").hasAuthority("INSTRUTOR")
                        .requestMatchers(HttpMethod.GET, "/api/agendamentos/aula/{aulaId}").hasAuthority("INSTRUTOR")
                        .requestMatchers(HttpMethod.POST, "/api/agendamentos/{agendamentoId}/presenca").hasAuthority("INSTRUTOR")
                        
                        .requestMatchers(HttpMethod.GET, "/api/agendamentos/meus-proximos").hasAuthority("ALUNO")
                        .requestMatchers(HttpMethod.GET, "/api/agendamentos/{id}").hasAuthority("ALUNO")
                        .requestMatchers(HttpMethod.DELETE, "/api/agendamentos/me/{agendamentoId}").hasAuthority("ALUNO")
                        .requestMatchers(HttpMethod.POST, "/api/agendamentos").hasAuthority("ALUNO")

                        .requestMatchers(HttpMethod.GET, "/api/usuarios/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/aulas/**").authenticated()

                        .anyRequest().authenticated() 
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}