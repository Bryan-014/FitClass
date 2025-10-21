package com.fitclass.academia_api.DTO;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String login;
    private String senha;
}