package com.codeplatform.backend.problemtemplate;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProblemTemplateRepository extends JpaRepository<ProblemTemplateEntity, Long> {

    boolean existsByProblemIdAndLanguageId(Long problemId, Long languageId);

    Optional<ProblemTemplateEntity> findByProblemIdAndLanguageId(Long problemId, Long languageId);

    List<ProblemTemplateEntity> findByProblemId(Long problemId);
}