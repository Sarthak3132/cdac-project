package com.codeplatform.backend.problemExecution.dto;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ProblemExecutionResultMessage {
    String referenceId;      // DB reference id — used to find/update the submission row
    String websocketId;    // random UUID — used only as the STOMP destination
    String overallStatus;
    int passedCount;
    int totalCount;
    String compileError;
    TestCaseResultDto failedTestCase;
}