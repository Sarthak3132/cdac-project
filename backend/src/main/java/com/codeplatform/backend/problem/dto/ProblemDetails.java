package com.codeplatform.backend.problem.dto;

import com.codeplatform.backend.problem.ProblemDifficulty;
import com.codeplatform.backend.tags.dto.TagResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProblemDetails {


    private Long id;
    private String title;
    private String slug;
    private String description;
    private ProblemDifficulty problemDifficulty;
    private Integer timeLimitMs;
    private Integer memoryLimitKb;
    private Boolean isPublished;
    private List<TagResponse> tags;
    private Instant createdAt;
    private Instant updatedAt;
}
