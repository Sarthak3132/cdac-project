package com.worker.problemSubmit;


import java.util.List;

public class Dtos {

    public record TestCaseDto(String testCaseId, String inputData, String expectedOutput) {}

    public record ProblemExecutionMessage(
            String sessionId, String sourceCode, Integer judge0LanguageId,
            List<TestCaseDto> testCases, String mode, Integer timeLimitMs, Integer memoryLimitKb
    ) {}

    public record TestCaseResultDto(
            String testCaseId, String inputData, boolean passed, String actualOutput, String expectedOutput,
            String stderr, String statusDescription, Double time, Integer memory
    ) {}

    public record ProblemExecutionResultMessage(
            String sessionId, String overallStatus, int passedCount, int totalCount,
            List<TestCaseResultDto> results
    ) {}

    public record Judge0Request(String source_code, Integer language_id, String stdin,
                                Double cpu_time_limit, Integer memory_limit) {}

    public record Judge0Result(
            String stdout, String stderr, String compile_output, Status status,
            String time, Integer memory, String error
    ) {
        public record Status(int id, String description) {}
    }
}