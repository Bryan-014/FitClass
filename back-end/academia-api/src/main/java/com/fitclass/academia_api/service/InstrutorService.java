package com.fitclass.academia_api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.fitclass.academia_api.model.Instrutor;
import com.fitclass.academia_api.repository.InstrutorRepository;

@Service
public class InstrutorService {

    private final InstrutorRepository instrutorRepository;

    public InstrutorService(InstrutorRepository instrutorRepository) {
        this.instrutorRepository = instrutorRepository;
    }

    public Optional<Instrutor> buscarPorId(Long id) {
        return instrutorRepository.findById(id);
    }

    public List<Instrutor> listarTodos() {
        return instrutorRepository.findAll();
    }

    public Instrutor criarInstrutor(Instrutor instrutor) {

        return instrutorRepository.save(instrutor);
    }

    public void deletarInstrutor(Long id) {
        if (!instrutorRepository.existsById(id)) {
            throw new RuntimeException("Instrutor não encontrado com o id: " + id);
        }
        instrutorRepository.deleteById(id);
    }

    public Instrutor atualizarInstrutor(Long id, Instrutor instrutorDetalhes) {

        Instrutor instrutor = instrutorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado com o id: " + id));

        instrutor.setNome(instrutorDetalhes.getNome());
        instrutor.setEspecialidade(instrutorDetalhes.getEspecialidade());

        return instrutorRepository.save(instrutor);
    }
}