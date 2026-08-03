package com.codeplatform.backend.problemtemplate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CreateProblemTemplateRequest {
    @NotNull(message = "Problem id is required")
    private Long problemId;
    @NotNull(message = "Language id is required")
    private Long languageId;
    @NotBlank(message = "Starter code is required")
    private String starterCode;
    @NotBlank(message = "Driver code is required")
    private String driverCode;
}