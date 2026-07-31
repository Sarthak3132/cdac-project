package com.codeplatform.backend.messaging;

import com.codeplatform.backend.codeexecution.dto.CodeExecutionResultMessage;
import com.codeplatform.backend.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ResultListener {

    private final SimpMessagingTemplate webSocketTemplate; // or your STOMP broker of choice

    @RabbitListener(queues = RabbitMQConfig.CODE_RESULT_QUEUE)
    public void onCodeResult(CodeExecutionResultMessage result) {
        webSocketTemplate.convertAndSend("/topic/code-result/" + result.getSessionId(), result);
    }

//    @RabbitListener(queues = RabbitMQConfig.EXAMPLE_RESULT_QUEUE)
//    public void onExampleResult(ExampleResultMessage result) {
//        webSocketTemplate.convertAndSend("/topic/example-result/" + result.getSessionId(), result);
//    }
//
//    @RabbitListener(queues = RabbitMQConfig.SUBMISSION_RESULT_QUEUE)
//    public void onSubmissionResult(SubmissionResultMessage result) {
//        webSocketTemplate.convertAndSend("/topic/submission-result/" + result.getUserId(), result);
//    }
}