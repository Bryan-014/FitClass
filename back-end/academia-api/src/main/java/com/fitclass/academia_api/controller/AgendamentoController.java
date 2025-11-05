package com.fitclass.academia_api.controller;

import com.fitclass.academia_api.model.Agendamento;
import com.fitclass.academia_api.service.AgendamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.fitclass.academia_api.DTO.PresencaRequestDTO;

import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@RequiredArgsConstructor
public class AgendamentoController {

    private final AgendamentoService service;

    @PostMapping
    public ResponseEntity<?> agendarAula(@RequestBody AgendamentoRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Agendamento novoAgendamento = service.criarAgendamento(request.getAulaId(), userDetails.getUsername());
            return new ResponseEntity<>(novoAgendamento, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/meus-proximos")
    public ResponseEntity<List<Agendamento>> getMinhasProximasAulas(@AuthenticationPrincipal UserDetails userDetails) {
        List<Agendamento> agendamentos = service.buscarProximosAgendamentos(userDetails.getUsername());
        return ResponseEntity.ok(agendamentos);
    }

    static class AgendamentoRequest {
        private Long aulaId;

        public Long getAulaId() {
            return aulaId;
        }

        public void setAulaId(Long aulaId) {
            this.aulaId = aulaId;
        }
    }

    @GetMapping("/aula/{aulaId}")
    public ResponseEntity<List<Agendamento>> getAlunosDaAula(@PathVariable Long aulaId) {
        return ResponseEntity.ok(service.buscarPorAulaId(aulaId));
    }

    @PostMapping("/{agendamentoId}/presenca")
    public ResponseEntity<Agendamento> marcarPresenca(
            @PathVariable Long agendamentoId,
            @RequestBody PresencaRequestDTO request) {
        try {
            Agendamento agendamento = service.marcarPresenca(agendamentoId, request.isCompareceu());
            return ResponseEntity.ok(agendamento);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/me/{agendamentoId}")
    public ResponseEntity<Void> cancelarMeuAgendamento(
            @PathVariable Long agendamentoId,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            service.cancelarAgendamentoAluno(agendamentoId, userDetails.getUsername());
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}