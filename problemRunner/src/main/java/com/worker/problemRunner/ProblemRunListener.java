package com.worker.problemRunner;

import com.worker.problemRunner.config.RabbitMQConfig;
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

import com.worker.problemRunner.Dtos.*;


@Component
public class ProblemRunListener {

    private static final Logger log = LoggerFactory.getLogger(ProblemRunListener.class);

    private final RabbitTemplate rabbitTemplate;
    private final WebClient judge0;

    public ProblemRunListener(RabbitTemplate rabbitTemplate, @Value("${judge0.base-url}") String judge0BaseUrl) {
        this.rabbitTemplate = rabbitTemplate;
        this.judge0 = WebClient.builder().baseUrl(judge0BaseUrl).build();
    }

    @RabbitListener(queues = RabbitMQConfig.EXAMPLE_RUN_QUEUE)
    public void handle(Dtos.ProblemExecutionMessage msg) {
        log.info("Received RUN request | sessionId={} testCaseCount={}",
                msg.sessionId(), msg.testCases().size());

        System.out.println(msg.sourceCode());

        List<TestCaseResultDto> results = new ArrayList<>();
        int passedCount = 0;
        String overallStatus = "Accepted";

        for (TestCaseDto testCase : msg.testCases()) {
            TestCaseResultDto result = runSingleTestCase(msg, testCase);
            results.add(result);

            if (result.passed()) {
                passedCount++;
            } else if (overallStatus.equals("Accepted")) {
                overallStatus = result.statusDescription();
            }

            if ("Compilation Error".equals(result.statusDescription())) {
                overallStatus = "Compilation Error";
                break; // no point running remaining visible test cases after a compile failure
            }
        }

        ProblemExecutionResultMessage resultMessage = new ProblemExecutionResultMessage(
                msg.sessionId(), overallStatus, passedCount, msg.testCases().size(), results
        );

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.EXAMPLE_RESULT_QUEUE, resultMessage);

        log.info("Published RUN result | sessionId={} verdict={} passed={}/{}",
                msg.sessionId(), overallStatus, passedCount, msg.testCases().size());
    }

    private TestCaseResultDto runSingleTestCase(ProblemExecutionMessage msg, TestCaseDto testCase) {
        try {
            Judge0Request req = new Judge0Request(
                    encode(msg.sourceCode()), msg.judge0LanguageId(),
                    testCase.inputData() != null ? encode(testCase.inputData()) : null,
                    msg.timeLimitMs() != null ? msg.timeLimitMs() / 1000.0 : null,
                    msg.memoryLimitKb()
            );

            Judge0Result r = judge0.post()
                    .uri("/submissions?base64_encoded=true&wait=true")
                    .bodyValue(req)
                    .retrieve()
                    .bodyToMono(Judge0Result.class)
                    .block(Duration.ofSeconds(15));

            System.out.println(r);
            System.out.println("stdout = " + r.stdout());
            System.out.println("stderr = " + r.stderr());
            System.out.println("compile = " + r.compile_output());

            if (r.error() != null) {
                throw new RuntimeException("Judge0 error: " + r.error());
            }

            String statusDescription = r.status() != null ? r.status().description() : "Unknown";
            String actualOutput = decode(r.stdout());

            boolean compileError = r.compile_output() != null && !r.compile_output().isBlank();
            boolean passed = !compileError
                    && r.stderr() == null
                    && actualOutput != null
                    && normalize(actualOutput).equals(normalize(testCase.expectedOutput()));

            return new TestCaseResultDto(
                    testCase.testCaseId(),
                    testCase.inputData(),
                    passed,
                    actualOutput,
                    testCase.expectedOutput(),
                    decode(r.stderr()),
                    compileError ? "Compilation Error" : (passed ? "Accepted" : deriveFailureStatus(statusDescription, r.stderr())),
                    r.time() != null ? Double.parseDouble(r.time()) : null,
                    r.memory()
            );
        } catch (Exception e) {
            log.error("Test case execution failed | sessionId={} testCaseId={} error={}",
                    msg.sessionId(), testCase.testCaseId(), e.getMessage(), e);

            return new TestCaseResultDto(
                    testCase.testCaseId(), testCase.inputData(), false, null, testCase.expectedOutput(),
                    "Execution error: " + e.getMessage(), "Runtime Error", null, null
            );
        }
    }

    private String deriveFailureStatus(String judge0Status, String stderr) {
        if (stderr != null && !stderr.isBlank()) return "Runtime Error";
        if (judge0Status != null && !judge0Status.equals("Accepted")) return judge0Status;
        return "Wrong Answer";
    }

    private String normalize(String s) {
        return s == null ? "" : s.strip().replaceAll("\\r\\n", "\n");
    }

    private String encode(String s) {
        return Base64.getEncoder().encodeToString(s.getBytes(StandardCharsets.UTF_8));
    }

    private String decode(String s) {
        return s != null ? new String(Base64.getMimeDecoder().decode(s), StandardCharsets.UTF_8) : null;
    }
}