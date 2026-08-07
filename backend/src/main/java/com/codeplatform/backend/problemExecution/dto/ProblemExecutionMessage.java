package com.codeplatform.backend.problemExecution.dto;
import java.io.Serializable;
import java.util.List;


public record ProblemExecutionMessage(
        String referenceId,       // DB reference id (RUN: same as websocketId, no DB row)
        String websocketId,     // random UUID the worker must echo back on the result
        String sourceCode,
        Integer judge0LanguageId,
        List<TestCaseDto> testCases,
        String mode,              // "RUN" or "SUBMIT"
        Integer timeLimitMs,
        Integer memoryLimitKb
) implements Serializable {}