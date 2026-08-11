package com.worker.problemRunner;
import java.util.List;
public class Dtos {
    public record TestCaseDto(String testCaseId, String inputData, String expectedOutput) {}
    public record ProblemExecutionMessage(
            String referenceId, String websocketId, String sourceCode, Integer judge0LanguageId,
            List<TestCaseDto> testCases, String mode, Integer timeLimitMs, Integer memoryLimitKb
    ) {}
    public record TestCaseResultDto(
            String testCaseId, String inputData, boolean passed, String actualOutput, String expectedOutput,
            String stderr, String statusDescription, Double time, Integer memory
    ) {}
    public record ProblemExecutionResultMessage(
            String referenceId, String websocketId, String overallStatus, int passedCount, int totalCount,
            String compileError, TestCaseResultDto failedTestCase
    ) {}
    public record Judge0Request(String source_code, Integer language_id, String stdin,
                                Double cpu_time_limit, Integer memory_limit) {}
    public record Judge0Result(
            String stdout, String stderr, String compile_output, Status status,
            String time, Integer memory, String error
    ) {
        public record Status(int id, String description) {}
    }
    public record Judge0BatchRequest(List<Judge0Request> submissions) {}
    public record Judge0BatchToken(String token) {}
    public record Judge0BatchResultResponse(List<Judge0Result> submissions) {}
}