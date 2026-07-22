package com.codeplatform.backend.language;

import com.codeplatform.backend.exception.ConflictException;
import com.codeplatform.backend.exception.ResourceNotFoundException;
import com.codeplatform.backend.language.dto.CreateLanguageRequest;
import com.codeplatform.backend.language.dto.LanguageResponse;
import com.codeplatform.backend.language.dto.UpdateLanguageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageService {

    private final LanguageRepository repository;
    private final LanguageMapper mapper;

    public LanguageResponse create(CreateLanguageRequest request) {

        if (repository.existsByNameIgnoreCase(request.getName())) {
            throw new ConflictException("Language already exists.");
        }

        LanguageEntity language = mapper.toEntity(request);

        if (language.getEnabled() == null)
            language.setEnabled(true);

        if (language.getIsCompiled() == null)
            language.setIsCompiled(true);

        return mapper.toDto(repository.save(language));
    }

    public List<LanguageResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public LanguageResponse getById(Long id) {

        LanguageEntity language = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Language not found."));

        return mapper.toDto(language);
    }

    public LanguageResponse update(Long id, UpdateLanguageRequest request) {

        LanguageEntity language = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Language not found."));

        language.setName(request.getName());
        language.setVersion(request.getVersion());
        language.setDockerImage(request.getDockerImage());
        language.setSourceFile(request.getSourceFile());
        language.setCompileCommand(request.getCompileCommand());
        language.setRunCommand(request.getRunCommand());
        language.setIsCompiled(request.getIsCompiled());
        language.setEnabled(request.getEnabled());

        return mapper.toDto(repository.save(language));
    }

    public void delete(Long id) {

        LanguageEntity language = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Language not found."));

        repository.delete(language);
    }

}