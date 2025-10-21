package com.fitclass.academia_api.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/hello")
    public String sayHello(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return "Erro: UserDetails é nulo. O usuário não foi autenticado corretamente.";
        }
        return "Olá, " + userDetails.getUsername() + "! Suas permissões são: " + userDetails.getAuthorities();
    }
}