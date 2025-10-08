package com.fitclass.academia_api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fitclass.academia_api.model.Aluno;
import com.fitclass.academia_api.repository.AlunoRepository;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;

    public AlunoService(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    public Optional<Aluno> buscarPorId(Long id) {
        return alunoRepository.findById(id);
    }

    public List<Aluno> listarTodos() {
        return alunoRepository.findAll();
    }

    public Aluno criarAluno(Aluno aluno) {

        return alunoRepository.save(aluno);
    }

    public void deletarAluno(Long id) {
        if (!alunoRepository.existsById(id)) {
            throw new RuntimeException("Aluno não encontrado com o id: " + id);
        }
        alunoRepository.deleteById(id);
    }

    public Aluno atualizarAluno(Long id, Aluno alunoDetalhes) {

        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com o id: " + id));

        aluno.setNome(alunoDetalhes.getNome());
        aluno.setPenalidade(alunoDetalhes.getPenalidade());

        return alunoRepository.save(aluno);
    }
}