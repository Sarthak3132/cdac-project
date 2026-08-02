package com.codeplatform.backend.messaging;

import com.codeplatform.backend.codeexecution.dto.CodeExecutionResultMessage;
import com.codeplatform.backend.config.RabbitMQConfig;
import com.codeplatform.backend.problemExecution.dto.ProblemExecutionResultMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ResultListener {

    private final SimpMessagingTemplate webSocketTemplate;

    @RabbitListener(queues = RabbitMQConfig.CODE_RESULT_QUEUE)
    public void onCodeResult(CodeExecutionResultMessage result) {
        webSocketTemplate.convertAndSend("/topic/code-result/" + result.getSessionId(), result);
    }

    @RabbitListener(queues = RabbitMQConfig.EXAMPLE_RESULT_QUEUE)
    public void onExampleResult(ProblemExecutionResultMessage result) {
        webSocketTemplate.convertAndSend("/topic/example-result/" + result.getSessionId(), result);
    }

    @RabbitListener(queues = RabbitMQConfig.SUBMISSION_RESULT_QUEUE)
    public void onSubmissionResult(ProblemExecutionResultMessage result) {
        // TODO: persist verdict/passedCount/failure details to SubmissionEntity here
        // (submissionRepository.findById(Long.valueOf(result.sessionId()))...)
        webSocketTemplate.convertAndSend("/topic/submission-result/" + result.getSessionId(), result);
    }
}