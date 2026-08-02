package com.codeplatform.backend.problemExecution;

import com.codeplatform.backend.language.LanguageEntity;
import com.codeplatform.backend.problem.ProblemEntity;
import com.codeplatform.backend.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "problem_id", nullable = false)
    @ToString.Exclude
    private ProblemEntity problem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "language_id", nullable = false)
    @ToString.Exclude
    private LanguageEntity language;

    // null until the result arrives from the submission worker
    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private SubmissionVerdict verdict;

    @Column(name = "cpu_time_ms")
    private Integer cpuTimeMs;

    @Column(name = "memory_usage_kb")
    private Integer memoryUsageKb;

    @Column(name = "code_body", nullable = false, columnDefinition = "TEXT")
    private String codeBody;

    @Column(name = "total_testcases", nullable = false)
    private Integer totalTestcases;

    @Column(name = "passed_testcases")
    private Integer passedTestcases;

    @Column(name = "failure_input", columnDefinition = "TEXT")
    private String failureInput;

    @Column(name = "expected_output", columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(name = "actual_output", columnDefinition = "TEXT")
    private String actualOutput;

    @Column(name = "diagnostic_message", columnDefinition = "TEXT")
    private String diagnosticMessage;

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private Instant submittedAt;
}