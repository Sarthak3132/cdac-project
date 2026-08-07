package com.worker.problemSubmit;


import com.worker.problemSubmit.Dtos.*;
import com.worker.problemSubmit.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Component
public class ProblemSubmitListener {

    private static final Logger log = LoggerFactory.getLogger(ProblemSubmitListener.class);

    // how long to wait between each "are you done yet?" check
    private static final int POLL_INTERVAL_MS = 500;
    // give up after this many checks (30 x 500ms = 15 seconds max wait)
    private static final int MAX_POLL_ATTEMPTS = 30;
    // which pieces of data we want back from Judge0 for each test case
    private static final String BATCH_FIELDS = "stdout,stderr,compile_output,status,time,memory";

    private final RabbitTemplate rabbitTemplate;
    private final WebClient judge0;

    public ProblemSubmitListener(RabbitTemplate rabbitTemplate, @Value("${judge0.base-url}") String judge0BaseUrl) {
        this.rabbitTemplate = rabbitTemplate;
        this.judge0 = WebClient.builder().baseUrl(judge0BaseUrl).build();
    }

    @RabbitListener(queues = RabbitMQConfig.SUBMISSION_QUEUE)
    public void handle(ProblemExecutionMessage msg) {
        log.info("Received SUBMIT request | referenceId={} websocketId={} testCaseCount={}",
                msg.referenceId(), msg.websocketId(), msg.testCases().size());

        int passedCount = 0;
        String overallStatus = "Accepted";
        String compileErrorMessage = null;
        TestCaseResultDto failedTestCase = null;

        try {
            List<TestCaseDto> testCases = msg.testCases();
            TestCaseDto firstTestCase = testCases.get(0);

            TestCaseResultDto firstResult = runSingleTestCase(msg, firstTestCase);

            if ("Compilation Error".equals(firstResult.statusDescription())) {
                compileErrorMessage = firstResult.stderr();
                overallStatus = "Compilation Error";

            } else if (!firstResult.passed()) {
                failedTestCase = firstResult;
                overallStatus = firstResult.statusDescription();

            } else {
                passedCount = 1;

                if (testCases.size() > 1) {
                    List<TestCaseDto> remaining = testCases.subList(1, testCases.size());
                    List<String> tokens = submitAllTestCases(msg, remaining);
                    List<Judge0Result> judge0Results = waitForResults(tokens);

                    for (int i = 0; i < remaining.size(); i++) {
                        TestCaseResultDto result = buildResult(remaining.get(i), judge0Results.get(i));

                        if (result.passed()) {
                            passedCount++;
                        } else if (failedTestCase == null) {
                            failedTestCase = result;
                            overallStatus = result.statusDescription();
                        }
                    }
                }
            }

        } catch (Exception e) {
            log.error("Batch execution failed | referenceId={} error={}", msg.referenceId(), e.getMessage(), e);
            overallStatus = "Runtime Error";
            passedCount = 0;
            failedTestCase = new TestCaseResultDto(
                    null, null, false, null, null,
                    "Execution error: " + e.getMessage(), "Runtime Error", null, null
            );
        }

        ProblemExecutionResultMessage resultMessage = new ProblemExecutionResultMessage(
                msg.referenceId(), msg.websocketId(), overallStatus, passedCount, msg.testCases().size(),
                compileErrorMessage, failedTestCase
        );

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.SUBMISSION_RESULT_QUEUE, resultMessage);

        log.info("Published SUBMIT result | referenceId={} websocketId={} verdict={} passed={}/{}",
                msg.referenceId(), msg.websocketId(), overallStatus, passedCount, msg.testCases().size());
    }

    // Runs ONE test case directly (not through the batch endpoint) and waits for
    // the result inline. Used only for the first test case, so we get an answer
    // as fast as possible without paying for a submit-then-poll round trip.
    private TestCaseResultDto runSingleTestCase(ProblemExecutionMessage msg, TestCaseDto testCase) {
        Judge0Request request = new Judge0Request(
                encode(msg.sourceCode()),
                msg.judge0LanguageId(),
                testCase.inputData() != null ? encode(testCase.inputData()) : null,
                msg.timeLimitMs() != null ? msg.timeLimitMs() / 1000.0 : null,
                msg.memoryLimitKb()
        );

        Judge0Result r = judge0.post()
                .uri("/submissions?base64_encoded=true&wait=true")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Judge0Result.class)
                .block(Duration.ofSeconds(15));

        return buildResult(testCase, r);
    }

    // Builds one Judge0Request per test case and sends them ALL together in a single
    // HTTP call. Judge0 replies with one "token" per submission — think of a token as
    // a receipt number you use later to collect the result.
    private List<String> submitAllTestCases(ProblemExecutionMessage msg, List<TestCaseDto> testCases) {
        List<Judge0Request> submissions = new ArrayList<>();

        for (TestCaseDto testCase : testCases) {
            Judge0Request request = new Judge0Request(
                    encode(msg.sourceCode()),
                    msg.judge0LanguageId(),
                    testCase.inputData() != null ? encode(testCase.inputData()) : null,
                    msg.timeLimitMs() != null ? msg.timeLimitMs() / 1000.0 : null,
                    msg.memoryLimitKb()
            );
            submissions.add(request);
        }

        List<Judge0BatchToken> tokens = judge0.post()
                .uri("/submissions/batch?base64_encoded=true")
                .bodyValue(new Judge0BatchRequest(submissions))
                .retrieve()
                .bodyToFlux(Judge0BatchToken.class)
                .collectList()
                .block(Duration.ofSeconds(15));

        List<String> tokenStrings = new ArrayList<>();
        for (Judge0BatchToken token : tokens) {
            tokenStrings.add(token.token());
        }
        return tokenStrings;
    }

    // Judge0 runs code in the background, so submitting doesn't mean it's finished yet.
    // This keeps asking "are these tokens done?" every 500ms until every single one has
    // a final status (not just "In Queue" or "Processing"), or we give up after 15 seconds.
    private List<Judge0Result> waitForResults(List<String> tokens) throws InterruptedException {
        String tokenParam = String.join(",", tokens);
        String uri = "/submissions/batch?tokens=" + tokenParam + "&base64_encoded=true&fields=" + BATCH_FIELDS;

        for (int attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
            Judge0BatchResultResponse response = judge0.get()
                    .uri(uri)
                    .retrieve()
                    .bodyToMono(Judge0BatchResultResponse.class)
                    .block(Duration.ofSeconds(15));

            List<Judge0Result> submissions = response.submissions();

            boolean anyStillRunning = false;
            for (Judge0Result r : submissions) {
                // status id 1 = "In Queue", 2 = "Processing" — anything higher means it's finished
                if (r.status() == null || r.status().id() <= 2) {
                    anyStillRunning = true;
                    break;
                }
            }

            if (!anyStillRunning) {
                return submissions;
            }

            Thread.sleep(POLL_INTERVAL_MS);
        }

        throw new RuntimeException("Judge0 batch polling timed out after " + MAX_POLL_ATTEMPTS + " attempts");
    }

    // Turns Judge0's raw result for one test case into our own TestCaseResultDto,
    // deciding whether it passed and what status to show.
    private TestCaseResultDto buildResult(TestCaseDto testCase, Judge0Result r) {
        if (r.error() != null) {
            return new TestCaseResultDto(
                    testCase.testCaseId(), testCase.inputData(), false, null, testCase.expectedOutput(),
                    "Judge0 error: " + r.error(), "Runtime Error", null, null
            );
        }

        String statusDescription = r.status() != null ? r.status().description() : "Unknown";
        String actualOutput = decode(r.stdout());

        boolean compileError = r.compile_output() != null && !r.compile_output().isBlank();
        boolean passed = !compileError
                && r.stderr() == null
                && actualOutput != null
                && normalize(actualOutput).equals(normalize(testCase.expectedOutput()));

        String finalStatus;
        String errorText;
        if (compileError) {
            finalStatus = "Compilation Error";
            errorText = decode(r.compile_output()); // the actual compiler error message
        } else if (passed) {
            finalStatus = "Accepted";
            errorText = decode(r.stderr());
        } else {
            finalStatus = deriveFailureStatus(statusDescription, r.stderr());
            errorText = decode(r.stderr());
        }

        return new TestCaseResultDto(
                testCase.testCaseId(),
                testCase.inputData(),
                passed,
                actualOutput,
                testCase.expectedOutput(),
                errorText,
                finalStatus,
                r.time() != null ? Double.parseDouble(r.time()) : null,
                r.memory()
        );
    }

    // Picks a human-readable failure reason when the test case didn't pass.
    private String deriveFailureStatus(String judge0Status, String stderr) {
        if (stderr != null && !stderr.isBlank()) return "Runtime Error";
        if (judge0Status != null && !judge0Status.equals("Accepted")) return judge0Status;
        return "Wrong Answer";
    }

    // Cleans up line endings and whitespace so output comparisons aren't broken by tiny formatting differences.
    private String normalize(String s) {
        return s == null ? "" : s.strip().replaceAll("\\r\\n", "\n");
    }

    // Judge0 expects source code / input as Base64 text, so we encode before sending.
    private String encode(String s) {
        return Base64.getEncoder().encodeToString(s.getBytes(StandardCharsets.UTF_8));
    }

    // Judge0 sends output back as Base64 text, so we decode it to get the real text.
    private String decode(String s) {
        return s != null ? new String(Base64.getMimeDecoder().decode(s), StandardCharsets.UTF_8) : null;
    }
}