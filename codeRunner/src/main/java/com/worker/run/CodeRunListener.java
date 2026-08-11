package com.worker.run;

import com.worker.run.Dtos.*;
import com.worker.run.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;

@Component
public class CodeRunListener {

    private static final Logger log = LoggerFactory.getLogger(CodeRunListener.class);

    private final RabbitTemplate rabbitTemplate;
    private final WebClient judge0;

    public CodeRunListener(RabbitTemplate rabbitTemplate, @Value("${judge0.base-url}") String judge0BaseUrl) {
        this.rabbitTemplate = rabbitTemplate;
        this.judge0 = WebClient.builder().baseUrl(judge0BaseUrl).build();
    }

    @RabbitListener(queues = RabbitMQConfig.CODE_RUN_QUEUE)
    public void handle(CodeRunMessage msg) {
        long startedAt = System.currentTimeMillis();

        log.info("Received run request | sessionId={} languageId={} sourceLength={}",
                msg.sessionId(), msg.judge0LanguageId(),
                msg.sourceCode() != null ? msg.sourceCode().length() : 0);

        // there's only ever ONE Judge0 call here — this endpoint takes a single
        // stdin, not a list of test cases, so unlike the problem run/submit
        // workers there's nothing to batch or short-circuit on
        CodeExecutionResultMessage result = runCode(msg);

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.CODE_RESULT_QUEUE, result);

        log.info("Published result | sessionId={} status={} durationMs={}",
                msg.sessionId(), result.statusDescription(), System.currentTimeMillis() - startedAt);
    }

    private CodeExecutionResultMessage runCode(CodeRunMessage msg) {
        try {
            Judge0Request req = new Judge0Request(
                    encode(msg.sourceCode()),
                    msg.judge0LanguageId(),
                    encode(msg.stdin())
            );

            Judge0Result r = judge0.post()
                    .uri("/submissions?base64_encoded=true&wait=true")
                    .bodyValue(req)
                    .retrieve()
                    .bodyToMono(Judge0Result.class)
                    .block(Duration.ofSeconds(15));

            return buildResult(msg.sessionId(), r);

        } catch (Exception e) {
            log.error("Execution failed | sessionId={} error={}", msg.sessionId(), e.getMessage(), e);
            return new CodeExecutionResultMessage(
                    msg.sessionId(), null, "Execution error: " + e.getMessage(), null, "Error", null, null
            );
        }
    }

    private CodeExecutionResultMessage buildResult(String sessionId, Judge0Result r) {
        String status = r.status() != null ? r.status().description() : "Unknown";

        return new CodeExecutionResultMessage(
                sessionId,
                decode(r.stdout()),
                decode(r.stderr()),
                decode(r.compile_output()),
                status,
                r.time() != null ? Double.parseDouble(r.time()) : null,
                r.memory()
        );
    }

    private static String encode(String value) {
        return value != null ? Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8)) : null;
    }

    private static String decode(String value) {
        return value != null ? new String(Base64.getMimeDecoder().decode(value), StandardCharsets.UTF_8) : null;
    }
}