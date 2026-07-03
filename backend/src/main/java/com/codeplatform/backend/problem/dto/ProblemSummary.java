package com.codeplatform.backend.problem.dto;

import com.codeplatform.backend.problem.ProblemDifficulty;
import com.codeplatform.backend.tags.dto.TagResponse;
import lombok.*;

import java.util.List;

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

}