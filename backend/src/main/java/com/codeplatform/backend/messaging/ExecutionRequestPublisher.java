package com.codeplatform.backend.messaging;

import com.codeplatform.backend.codeexecution.dto.CodeRunMessage;
import com.codeplatform.backend.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@RequiredArgsConstructor
public class ExecutionRequestPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishCodeRun(CodeRunMessage message) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.CODE_RUN_QUEUE, message);
    }

//    public void publishExampleRun(ExampleRunMessage message) {
//        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.EXAMPLE_RUN_QUEUE, message);
//    }
//
//    public void publishSubmission(SubmissionMessage message) {
//        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.SUBMISSION_QUEUE, message);
//    }
}