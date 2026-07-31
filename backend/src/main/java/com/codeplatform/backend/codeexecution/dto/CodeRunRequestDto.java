package com.codeplatform.backend.codeexecution.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// CodeRunRequestDto.java — what the frontend sends
public record CodeRunRequestDto(
        @NotBlank String sourceCode,
        @NotNull Long languageId,      // FK to LanguageEntity
        String stdin                   // optional
) {}
