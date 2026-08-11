package com.codeplatform.backend.problem.dto;

import com.codeplatform.backend.problem.ProblemDifficulty;

import lombok.*;

import java.time.Instant;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemSummary {

    private Long id;

    private String title;

    private String slug;

    private String description;

    private ProblemDifficulty problemDifficulty;

    private Instant createdAt;

}