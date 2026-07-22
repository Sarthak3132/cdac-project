package com.codeplatform.backend.problemexample;

import com.codeplatform.backend.problem.ProblemEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "problem_examples")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemExampleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private ProblemEntity problem;

    @Column(name = "input_data", nullable = false, columnDefinition = "TEXT")
    private String inputData;

    @Column(name = "output_data", nullable = false, columnDefinition = "TEXT")
    private String outputData;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
}