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
            throw new ConflictException("Language name already exists.");
        }



        LanguageEntity language = mapper.toEntity(request);

        language.setEnabled(
                request.getEnabled() != null ? request.getEnabled() : true
        );

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
        language.setShortName(request.getShortName());
        language.setFileExtension(request.getFileExtension());
        language.setVersion(request.getVersion());
        language.setJudge0LanguageId(request.getJudge0LanguageId());
        language.setEnabled(
                request.getEnabled() != null ? request.getEnabled() : true
        );

        return mapper.toDto(repository.save(language));
    }

    public void delete(Long id) {

        LanguageEntity language = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Language not found."));

        repository.delete(language);
    }

}