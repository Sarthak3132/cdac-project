package com.codeplatform.backend.pythonAi.dto;

import lombok.Data;

@Data
public class ComplexityRequest {
    private String sourceCode;
    private String language;
    private Long problemId;
}