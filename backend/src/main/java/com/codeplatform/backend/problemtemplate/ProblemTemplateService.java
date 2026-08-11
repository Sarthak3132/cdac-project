package com.codeplatform.backend.problemtemplate;

import com.codeplatform.backend.exception.ConflictException;
import com.codeplatform.backend.exception.LanguageNotFound;
import com.codeplatform.backend.exception.ProblemNotFound;
import com.codeplatform.backend.exception.ProblemTemplateNotFound;
import com.codeplatform.backend.language.LanguageEntity;
import com.codeplatform.backend.language.LanguageRepository;
import com.codeplatform.backend.problem.ProblemEntity;
import com.codeplatform.backend.problem.ProblemRepository;
import com.codeplatform.backend.problemtemplate.dto.CreateProblemTemplateRequest;
import com.codeplatform.backend.problemtemplate.dto.ProblemTemplateResponse;
import com.codeplatform.backend.problemtemplate.dto.TemplateDetailsResponse;
import com.codeplatform.backend.problemtemplate.dto.UpdateProblemTemplateRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemTemplateService {

    private final ProblemTemplateRepository problemTemplateRepository;
    private final ProblemRepository problemRepository;
    private final LanguageRepository languageRepository;

    /**
     * Create Problem Template
     */
    public ProblemTemplateResponse createTemplate(CreateProblemTemplateRequest request) {

        if (problemTemplateRepository.existsByProblemIdAndLanguageId(
                request.getProblemId(), request.getLanguageId())) {
            throw new ConflictException("A template already exists for this problem and language.");
        }

        ProblemEntity problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() ->
                        new ProblemNotFound("Problem not found with id: " + request.getProblemId()));

        LanguageEntity language = languageRepository.findById(request.getLanguageId())
                .orElseThrow(() ->
                        new LanguageNotFound("Language not found with id: " + request.getLanguageId()));

        ProblemTemplateEntity template = ProblemTemplateEntity.builder()
                .problem(problem)
                .language(language)
                .starterCode(request.getStarterCode())
                .driverCode(request.getDriverCode())
                .build();

        ProblemTemplateEntity savedTemplate = problemTemplateRepository.save(template);

        return toResponse(savedTemplate);
    }

    /**
     * Get Template By Id
     */
    public TemplateDetailsResponse getTemplateById(Long id) {

        ProblemTemplateEntity template = problemTemplateRepository.findById(id)
                .orElseThrow(() ->
                        new ProblemTemplateNotFound("Template not found with id: " + id));

        return TemplateDetailsResponse.toDetailsResponse(template);
    }

    /**
     * Get All Templates For A Problem
     */
    public List<ProblemTemplateResponse> getTemplatesByProblem(Long problemId) {


        List<ProblemTemplateEntity> templates =
                problemTemplateRepository.findByProblemId(problemId);

        return templates.stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Update Template
     */
    public ProblemTemplateResponse updateTemplate(
            Long id,
            UpdateProblemTemplateRequest request
    ) {

        ProblemTemplateEntity template = problemTemplateRepository.findById(id)
                .orElseThrow(() ->
                        new ProblemTemplateNotFound("Template not found with id: " + id));

        if (request.getStarterCode() != null) {
            template.setStarterCode(request.getStarterCode());
        }

        if (request.getDriverCode() != null) {
            template.setDriverCode(request.getDriverCode());
        }

        ProblemTemplateEntity updatedTemplate = problemTemplateRepository.save(template);

        return toResponse(updatedTemplate);
    }

    /**
     * Delete Template
     */
    public void deleteTemplate(Long id) {

        ProblemTemplateEntity template = problemTemplateRepository.findById(id)
                .orElseThrow(() ->
                        new ProblemTemplateNotFound("Template not found with id: " + id));

        problemTemplateRepository.delete(template);
    }

    /**
     * Entity -> DTO
     */
    private ProblemTemplateResponse toResponse(ProblemTemplateEntity template) {
        return ProblemTemplateResponse.builder()
                .id(template.getId())
                .problemId(template.getProblem().getId())
                .problemTitle(template.getProblem().getTitle())
                .languageId(template.getLanguage().getId())
                .languageName(template.getLanguage().getName())
                .starterCode(template.getStarterCode())
                .build();
    }
}