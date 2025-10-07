package com.fitclass.academia_api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fitclass.academia_api.model.Instrutor;
import com.fitclass.academia_api.service.InstrutorService;

@RestController 
@RequestMapping("/api/instrutores") 
public class InstrutorController {

    private final InstrutorService instrutorService;
    
    public InstrutorController(InstrutorService instrutorService) {
        this.instrutorService = instrutorService;
    }

    @PostMapping 
    public ResponseEntity<Instrutor> cadastrarInstrutor(@RequestBody Instrutor instrutor) {
        Instrutor novoInstrutor = instrutorService.criarInstrutor(instrutor);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoInstrutor);
    }
}