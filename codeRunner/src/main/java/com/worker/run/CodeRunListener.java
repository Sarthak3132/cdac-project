package com.worker.run;

import com.worker.run.config.RabbitMQConfig;
import com.worker.run.Dtos.*;
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

    public CodeRunListener(
            RabbitTemplate rabbitTemplate,
            @Value("${judge0.base-url}") String judge0BaseUrl
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.judge0 = WebClient.builder()
                .baseUrl(judge0BaseUrl)
                .build();
    }

    @RabbitListener(queues = RabbitMQConfig.CODE_RUN_QUEUE)
    public void handle(CodeRunMessage msg) {
        long startedAt = System.currentTimeMillis();
        log.info(
                "Received run request | sessionId={} languageId={} sourceLength={}",
                msg.sessionId(),
                msg.judge0LanguageId(),
                msg.sourceCode() != null ? msg.sourceCode().length() : 0
        );

        CodeExecutionResultMessage result;
        try {
            Judge0Request req = new Judge0Request(
                    encode(msg.sourceCode()),
                    msg.judge0LanguageId(),
                    encode(msg.stdin())
            );

            log.info("Source Code:\n{}", msg.sourceCode());

            Judge0Result r = judge0.post()
                    .uri("/submissions?base64_encoded=true&wait=true")
                    .bodyValue(req)
                    .retrieve()
                    .bodyToMono(Judge0Result.class)
                    .block(Duration.ofSeconds(15));

            log.info("Judge0 Response: {}", r);

            String status = r.status() != null ? r.status().description() : "Unknown";

            String stdout = decode(r.stdout());
            String stderr = decode(r.stderr());
            String compileOutput = decode(r.compile_output());

            log.info(
                    "Judge0 responded | sessionId={} status={} time={} memory={}",
                    msg.sessionId(), status, r.time(), r.memory()
            );

            result = new CodeExecutionResultMessage(
                    msg.sessionId(),
                    stdout,
                    stderr,
                    compileOutput,
                    status,
                    r.time() != null ? Double.parseDouble(r.time()) : null,
                    r.memory()
            );
        } catch (Exception e) {
            log.error(
                    "Execution failed | sessionId={} error={}",
                    msg.sessionId(), e.getMessage(), e
            );
            result = new CodeExecutionResultMessage(
                    msg.sessionId(), null,
                    "Execution error: " + e.getMessage(),
                    null, "Error", null, null
            );
        }

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.CODE_RESULT_QUEUE,
                result
        );
        log.info(
                "Published result | sessionId={} durationMs={}",
                msg.sessionId(), System.currentTimeMillis() - startedAt
        );
    }

    private static String encode(String value) {
        if (value == null) return null;
        return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private static String decode(String value) {
        if (value == null) return null;
        return new String(Base64.getMimeDecoder().decode(value), StandardCharsets.UTF_8);
    }
}