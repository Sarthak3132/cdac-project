package com.codeplatform.backend.problem.dto;

import com.codeplatform.backend.problem.ProblemDifficulty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProblemRequest{

        @NotBlank(message = "Title is required")
        String title;

        @NotBlank(message = "Description is required")
        String description;

        @NotNull(message = "Difficulty is required")
        ProblemDifficulty problemDifficulty;

        @NotNull(message = "Time limit is required")
        @Min(value = 1, message = "Time limit must be greater than 0")
        Integer timeLimitMs;

        @NotNull(message = "Memory limit is required")
        @Min(value = 1, message = "Memory limit must be greater than 0")
        Integer memoryLimitKb;

        private List<Long> tagIds;

        Boolean isPublished;
}