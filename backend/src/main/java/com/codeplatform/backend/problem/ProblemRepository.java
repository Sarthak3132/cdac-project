package com.codeplatform.backend.problem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ProblemRepository extends
        JpaRepository<ProblemEntity, Long>,
        JpaSpecificationExecutor<ProblemEntity> {

    boolean existsBySlug(String slug);
    Optional<ProblemEntity> findBySlug(String slug);

}