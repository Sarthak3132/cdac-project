package com.codeplatform.backend.problemExecution.dto;

import java.io.Serializable;

public record TestCaseDto(
        String testCaseId,
        String inputData,
        String expectedOutput
) implements Serializable {}