package com.codeplatform.backend.problem.dto;

import com.codeplatform.backend.problem.ProblemDifficulty;
import lombok.*;

import java.time.Instant;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemInfo {

    private Long id;

    private Long authorId;

    private String authorName;

    private String title;

    private String slug;

    private String description;

    private ProblemDifficulty problemDifficulty;

    private Integer timeLimitMs;

    private Integer memoryLimitKb;

    private Boolean isPublished;

    private Instant createdAt;

    private Instant updatedAt;

}