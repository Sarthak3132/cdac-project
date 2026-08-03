package com.worker.run;

public class Dtos {

    public record CodeRunMessage(
            String sessionId,
            String sourceCode,
            Integer judge0LanguageId,
            String stdin
    ) {}

    public record CodeExecutionResultMessage(
            String sessionId,
            String stdout,
            String stderr,
            String compileOutput,
            String statusDescription,
            Double time,
            Integer memory
    ) {}

    // Judge0 wire format — only the fields we actually read
    public record Judge0Result(
            String stdout,
            String stderr,
            String compile_output,
            Status status,
            String time,
            Integer memory
    ) {
        public record Status(int id, String description) {}
    }

    public record Judge0Request(String source_code, Integer language_id, String stdin) {}
}
