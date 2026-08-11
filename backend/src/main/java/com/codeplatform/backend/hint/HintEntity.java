package com.codeplatform.backend.hint;


import com.codeplatform.backend.problem.ProblemEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "problem_hints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HintEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private ProblemEntity problem;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
}