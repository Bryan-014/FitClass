package com.fitclass.academia_api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitclass.academia_api.DTO.AulaRequestDTO;
import com.fitclass.academia_api.model.Aula;
import com.fitclass.academia_api.service.AulaService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/aulas")
public class AulaController {

    private final AulaService aulaService;

    public AulaController(AulaService aulaService) {
        this.aulaService = aulaService;
    }

    @PostMapping
    public ResponseEntity<Aula> criarAula(@RequestBody AulaRequestDTO dto) {
        try {
            Aula novaAula = aulaService.criarAula(dto);
            return new ResponseEntity<>(novaAula, HttpStatus.CREATED); 
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); 
        }
    }

    @GetMapping
    public List<Aula> listarTodas() {
        return aulaService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aula> buscarPorId(@PathVariable Long id) {
        return aulaService.buscarPorId(id)
                .map(aula -> new ResponseEntity<>(aula, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND)); 
    }

    @PutMapping("/{id}")
    public ResponseEntity<Aula> atualizarAula(@PathVariable Long id, @RequestBody Aula aulaDetalhes) {
        try {
            Aula aulaAtualizada = aulaService.atualizarAula(id, aulaDetalhes);
            return new ResponseEntity<>(aulaAtualizada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); 
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAula(@PathVariable Long id) {
        try {
            aulaService.deletarAula(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        }
    }

    @GetMapping("/instrutor/me")
    public ResponseEntity<List<Aula>> getMinhasAulasInstrutor(@AuthenticationPrincipal UserDetails userDetails) {
        List<Aula> aulas = aulaService.buscarAulasPorInstrutor(userDetails.getUsername());
        return ResponseEntity.ok(aulas);
    }
}