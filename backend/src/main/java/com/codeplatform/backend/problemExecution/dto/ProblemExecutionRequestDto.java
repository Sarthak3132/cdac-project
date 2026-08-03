package com.codeplatform.backend.problemExecution.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProblemExecutionRequestDto(
        @NotBlank String sourceCode,
        @NotNull Long languageId
) {}