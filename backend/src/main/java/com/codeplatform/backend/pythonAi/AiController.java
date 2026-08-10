package com.codeplatform.backend.pythonAi;

import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.pythonAi.dto.AiRequestMessage;
import com.codeplatform.backend.pythonAi.dto.AiRequestType;
import com.codeplatform.backend.pythonAi.dto.ChatRequest;
import com.codeplatform.backend.pythonAi.dto.ComplexityRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiPublisher aiPublisher;

    @PostMapping("/complexity")
    public SuccessResponse<Map<String, String>> analyzeComplexity(
            @RequestBody ComplexityRequest body) {

        String sessionId = UUID.randomUUID().toString();

        log.info(
                "AI Complexity Request | sessionId={} | problemId={} | language={} | sourceCodeLength={}",
                sessionId,
                body.getProblemId(),
                body.getLanguage(),
                body.getSourceCode() != null ? body.getSourceCode().length() : 0
        );

        aiPublisher.publish(
                AiRequestMessage.builder()
                        .sessionId(sessionId)
                        .type(AiRequestType.COMPLEXITY)
                        .sourceCode(body.getSourceCode())
                        .language(body.getLanguage())
                        .problemId(body.getProblemId())
                        .build()
        );

        log.info(
                "AI Complexity Request Published | sessionId={} | type={}",
                sessionId,
                AiRequestType.COMPLEXITY
        );

        return new SuccessResponse<>(
                "complexity analysis request successful",
                Map.of("sessionId", sessionId)
        );
    }

    @PostMapping("/chat")
    public SuccessResponse<Map<String, String>> chat(
            @RequestBody ChatRequest body) {

        String sessionId = body.getSessionId() != null
                ? body.getSessionId()
                : UUID.randomUUID().toString();

        log.info(
                "AI Chat Request | sessionId={} | messageLength={} | historySize={} | problemTitle={} | sourceCodeLength={} | language={}",
                sessionId,
                body.getMessage() != null ? body.getMessage().length() : 0,
                body.getHistory() != null ? body.getHistory().size() : 0,
                body.getProblemTitle(),
                body.getSourceCode() != null ? body.getSourceCode().length() : 0,
                body.getLanguage()
        );

        aiPublisher.publish(
                AiRequestMessage.builder()
                        .sessionId(sessionId)
                        .type(AiRequestType.CHAT)
                        .message(body.getMessage())
                        .history(body.getHistory())
                        .problemTitle(body.getProblemTitle())
                        .problemDescription(body.getProblemDescription())
                        .sourceCode(body.getSourceCode())
                        .language(body.getLanguage())
                        .build()
        );

        log.info(
                "AI Chat Request Published | sessionId={} | type={}",
                sessionId,
                AiRequestType.CHAT
        );

        return new SuccessResponse<>(
                "chat request successful",
                Map.of("sessionId", sessionId)
        );
    }
}