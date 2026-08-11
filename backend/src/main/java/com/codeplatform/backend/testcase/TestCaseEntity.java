package com.codeplatform.backend.testcase;

import com.codeplatform.backend.problem.ProblemEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private ProblemEntity problem;

    // Input used internally by the judge
    @Column(name = "input_data", nullable = false, columnDefinition = "TEXT")
    private String inputData;

    // Input displayed to the user on the problem page
    @Column(name = "display_input", columnDefinition = "TEXT")
    private String displayInput;

    @Column(name = "expected_output", nullable = false, columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(nullable = false)
    private Boolean visible;
}