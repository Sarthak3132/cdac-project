package com.codeplatform.backend.pythonAi;

import com.codeplatform.backend.config.RabbitMQConfig;
import com.codeplatform.backend.pythonAi.dto.AiRequestMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publish(AiRequestMessage request) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.AI_REQUEST_QUEUE, request);
    }
}