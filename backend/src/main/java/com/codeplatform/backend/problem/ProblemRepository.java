package com.codeplatform.backend.problem;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProblemRepository extends JpaRepository<ProblemEntity, Long> {

    boolean existsBySlug(String slug);

    // TODO: tag filtering is accepted by ProblemFilter/controller but not yet
    // applied here since there's no tags relation on ProblemEntity. Add a
    // LEFT JOIN p.tags t / AND (:tag IS NULL OR t.name = :tag) once that
    // relation exists, otherwise the "tag" query param is silently ignored.
    @Query("""
    SELECT p
    FROM ProblemEntity p
    WHERE
        (:search IS NULL
         OR p.title LIKE CONCAT('%', :search, '%')
         OR p.slug LIKE CONCAT('%', :search, '%'))
    AND
        (:problemDifficulty IS NULL
         OR p.problemDifficulty = :problemDifficulty)
    """)
    Page<ProblemEntity> findProblems(
            @Param("search") String search,
            @Param("problemDifficulty") ProblemDifficulty problemDifficulty,
            Pageable pageable
    );

}

