package com.codeplatform.backend.user;

import com.codeplatform.backend.admin.dto.UserGrowthDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<UserEntity> findByUsername(String username);

    @Query("""
            SELECT u
            FROM UserEntity u
            WHERE (:search IS NULL OR :search = '' OR
                   LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR
                   LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY u.createdAt DESC
            """)
    Page<UserEntity> searchUsers(String search, Pageable pageable);

    // Analytics queries
    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.deletedAt IS NULL")
    Long countTotalUsers();

    @Query("""
            SELECT COUNT(u) FROM UserEntity u 
            WHERE u.deletedAt IS NULL 
            AND u.createdAt >= :thirtyDaysAgo
            """)
    Long countNewUsersLastMonth(@Param("thirtyDaysAgo") Instant thirtyDaysAgo);

    @Query("""
            SELECT COUNT(DISTINCT u.id) FROM UserEntity u
            JOIN SubmissionEntity s ON u.id = s.user.id
            WHERE u.deletedAt IS NULL
            AND s.submittedAt >= :sevenDaysAgo
            """)
    Long countActiveUsersThisWeek(@Param("sevenDaysAgo") Instant sevenDaysAgo);

    @Query("""
            SELECT new com.codeplatform.backend.admin.dto.UserGrowthDto(
                CAST(u.createdAt AS java.time.LocalDate),
                COUNT(u)
            )
            FROM UserEntity u
            WHERE u.deletedAt IS NULL
            AND u.createdAt >= :thirtyDaysAgo
            GROUP BY CAST(u.createdAt AS java.time.LocalDate)
            ORDER BY CAST(u.createdAt AS java.time.LocalDate) ASC
            """)
    List<UserGrowthDto> getUserGrowthLast30Days(@Param("thirtyDaysAgo") Instant thirtyDaysAgo);
}