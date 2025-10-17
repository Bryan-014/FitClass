package com.fitclass.academia_api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fitclass.academia_api.DTO.AulaRequestDTO;
import com.fitclass.academia_api.model.Aluno;
import com.fitclass.academia_api.model.Aula;
import com.fitclass.academia_api.model.Instrutor;
import com.fitclass.academia_api.repository.AlunoRepository;
import com.fitclass.academia_api.repository.AulaRepository;
import com.fitclass.academia_api.repository.InstrutorRepository;

@Service
public class AulaService {

    private final AulaRepository aulaRepository;
    private final InstrutorRepository instrutorRepository;
    private final AlunoRepository alunoRepository;

    public AulaService(AulaRepository aulaRepository, InstrutorRepository instrutorRepository,
            AlunoRepository alunoRepository) {
        this.aulaRepository = aulaRepository;
        this.instrutorRepository = instrutorRepository;
        this.alunoRepository = alunoRepository;
    }

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

        List<Aluno> alunos = alunoRepository
                .findAllById(dto.getAlunoId());

        if (alunos.size() != dto.getAlunoId().size()) {
            throw new RuntimeException("Um ou mais IDs de alunos são inválidos ou inexistentes.");
        }

        Aula novaAula = new Aula();

        novaAula.setInstrutor(instrutor);
        novaAula.setAlunos(alunos);

        novaAula.setNome(dto.getNomeAula());

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
        aula.setCriadoEm(aulaDetalhes.getCriadoEm());

        return aulaRepository.save(aula);
    }
}