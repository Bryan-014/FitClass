package com.fitclass.academia_api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fitclass.academia_api.DTO.AulaRequestDTO;
import com.fitclass.academia_api.model.Aula;
import com.fitclass.academia_api.model.Instrutor;
import com.fitclass.academia_api.repository.AulaRepository;
import com.fitclass.academia_api.repository.InstrutorRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AulaService {

    private final AulaRepository aulaRepository;
    private final InstrutorRepository instrutorRepository;

    public Optional<Aula> buscarPorId(Long id) {
        return aulaRepository.findById(id);
    }

    public List<Aula> listarTodos() {
        return aulaRepository.findAll();
    }

    public Aula criarAula(AulaRequestDTO dto) {
        Instrutor instrutor = instrutorRepository
                .findById(dto.getInstrutorId())
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado."));

        Aula novaAula = new Aula();
        novaAula.setNome(dto.getNome());
        novaAula.setDescricao(dto.getDescricao());
        novaAula.setDataHora(dto.getDataHora());
        novaAula.setDuracao(dto.getDuracao());
        novaAula.setCapacidade(dto.getCapacidade());
        novaAula.setLimiteCancelamentoHoras(dto.getLimiteCancelamentoHoras());
        novaAula.setInstrutor(instrutor);
        novaAula.setCriadoEm(LocalDateTime.now());

        return aulaRepository.save(novaAula);
    }

    public void deletarAula(Long id) {
        if (!aulaRepository.existsById(id)) {
            throw new RuntimeException("Aula não encontrada com o id: " + id);
        }
        aulaRepository.deleteById(id);
    }

    public Aula atualizarAula(Long id, Aula aulaDetalhes) {
        Aula aula = aulaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aula não encontrada com o id: " + id));

        aula.setNome(aulaDetalhes.getNome());
        aula.setDescricao(aulaDetalhes.getDescricao());
        aula.setDataHora(aulaDetalhes.getDataHora());
        aula.setDuracao(aulaDetalhes.getDuracao());
        aula.setCapacidade(aulaDetalhes.getCapacidade());
        aula.setLimiteCancelamentoHoras(aulaDetalhes.getLimiteCancelamentoHoras());

        return aulaRepository.save(aula);
    }

    public List<Aula> buscarAulasPorInstrutor(String login) {
        Instrutor instrutor = instrutorRepository.findByUsuario_Login(login)
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado para este login"));

        return aulaRepository.findByInstrutor_Id(instrutor.getId());
    }
}