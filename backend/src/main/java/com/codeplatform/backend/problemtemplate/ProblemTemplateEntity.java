package com.codeplatform.backend.problemtemplate;

import com.codeplatform.backend.language.LanguageEntity;
import com.codeplatform.backend.problem.ProblemEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(
        name = "problem_templates",
        uniqueConstraints = @UniqueConstraint(columnNames = {"problem_id", "language_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemTemplateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "problem_id", nullable = false)
    @ToString.Exclude
    private ProblemEntity problem;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "language_id", nullable = false)
    @ToString.Exclude
    private LanguageEntity language;

    @Column(name = "starter_code", nullable = false, columnDefinition = "TEXT")
    private String starterCode;

    @Column(name = "driver_code", nullable = false, columnDefinition = "TEXT")
    private String driverCode;
}

