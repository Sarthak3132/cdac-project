package com.codeplatform.backend.problemExecution.dto;

import java.io.Serializable;
import java.util.List;

public record ProblemExecutionMessage(
        String sessionId,
        String sourceCode,
        Integer judge0LanguageId,
        List<TestCaseDto> testCases,
        String mode,              // "RUN" or "SUBMIT"
        Integer timeLimitMs,
        Integer memoryLimitKb
) implements Serializable {}