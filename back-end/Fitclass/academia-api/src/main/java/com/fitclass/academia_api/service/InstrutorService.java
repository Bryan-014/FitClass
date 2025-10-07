package com.fitclass.academia_api.service;

import org.springframework.stereotype.Service;
import com.fitclass.academia_api.model.Instrutor;
import com.fitclass.academia_api.repository.InstrutorRepository;

@Service 
public class InstrutorService {

    private final InstrutorRepository instrutorRepository;

    public InstrutorService(InstrutorRepository instrutorRepository) {
        this.instrutorRepository = instrutorRepository;
    }

    /**
     * 
     * @param instrutor 
     * @return 
     */
    public Instrutor criarInstrutor(Instrutor instrutor) {

        return instrutorRepository.save(instrutor);
    }
}   