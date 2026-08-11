package com.codeplatform.backend.submission;
import org.springframework.data.domain.Pageable;
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
    @Query("""
            SELECT s.user.id AS userId,
                   s.user.username AS username,
                   COUNT(DISTINCT s.problem.id) AS solvedCount
            FROM SubmissionEntity s
            WHERE s.verdict = com.codeplatform.backend.submission.SubmissionVerdict.ACCEPTED
            GROUP BY s.user.id, s.user.username
            ORDER BY COUNT(DISTINCT s.problem.id) DESC
            """)
    List<LeaderboardProjection> findLeaderboard(Pageable pageable);
    interface LeaderboardProjection {
        Long getUserId();
        String getUsername();
        Long getSolvedCount();
    }
}