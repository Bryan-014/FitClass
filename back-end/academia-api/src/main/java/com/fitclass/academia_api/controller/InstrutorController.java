package com.fitclass.academia_api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @GetMapping
    public List<Instrutor> listarTodosInstrutores() {
        return instrutorService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Instrutor> buscarInstrutorPorId(@PathVariable Long id) {
        Optional<Instrutor> instrutor = instrutorService.buscarPorId(id);
        if (instrutor.isPresent()) {
            return ResponseEntity.ok(instrutor.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Instrutor> atualizarInstrutor(@PathVariable Long id,
            @RequestBody Instrutor instrutorDetalhes) {
        try {
            Instrutor instrutorAtualizado = instrutorService.atualizarInstrutor(id, instrutorDetalhes);
            return ResponseEntity.ok(instrutorAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}