package com.codeplatform.backend.problem.dto;

import com.codeplatform.backend.problem.ProblemDifficulty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateProblemRequest {

        // authorId removed: the author always comes from the authenticated
        // UserContext in ProblemService, so a client-supplied authorId was
        // both unused and a source of confusion for ProblemMapper.

        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Slug is required")
        private String slug;

        @NotBlank(message = "Description is required")
        private String description;

        @NotNull(message = "Difficulty is required")
        private ProblemDifficulty problemDifficulty;

        @NotNull(message = "Time limit is required")
        @Min(value = 1, message = "Time limit must be greater than 0")
        private Integer timeLimitMs;

        @NotNull(message = "Memory limit is required")
        @Min(value = 1, message = "Memory limit must be greater than 0")
        private Integer memoryLimitKb;

        private Boolean isPublished;
}