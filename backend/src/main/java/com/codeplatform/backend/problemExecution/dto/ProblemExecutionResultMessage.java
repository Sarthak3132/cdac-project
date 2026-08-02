package com.codeplatform.backend.problemExecution.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProblemExecutionResultMessage {
    String sessionId;
    String overallStatus;
    int passedCount;
    int totalCount;
    List<TestCaseResultDto> results;
}