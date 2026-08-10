package com.codeplatform.backend.submission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<SubmissionEntity, Long> {


    @Query("SELECT COUNT(s) FROM SubmissionEntity s")
    Long countTotalSubmissions();

    @Query("""
            SELECT COUNT(s) FROM SubmissionEntity s
            WHERE s.submittedAt >= CURRENT_TIMESTAMP - 7 DAY
            """)
    Long countSubmissionsThisWeek();

    List<SubmissionEntity> findByUser_IdAndProblem_IdOrderBySubmittedAtDesc(Long userId, Long problemId);
}