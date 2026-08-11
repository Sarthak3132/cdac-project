package com.codeplatform.backend.codeexecution;

import com.codeplatform.backend.codeexecution.dto.CodeRunMessage;
import com.codeplatform.backend.codeexecution.dto.CodeRunRequestDto;
import com.codeplatform.backend.config.RabbitMQConfig;
import com.codeplatform.backend.exception.BadRequestException;
import com.codeplatform.backend.language.LanguageEntity;
import com.codeplatform.backend.language.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CodeExecutionRequestService {

    private final RabbitTemplate rabbitTemplate;
    private final LanguageRepository languageRepository; // to resolve judge0LanguageId

    public String submitRun(CodeRunRequestDto requestDto) {
        LanguageEntity language = languageRepository.findById(requestDto.languageId())
                .filter(LanguageEntity::isEnabled)
                .orElseThrow(() -> new BadRequestException("Unsupported or disabled language"));

        String sessionId = UUID.randomUUID().toString();

        CodeRunMessage message = new CodeRunMessage(
                sessionId,
                requestDto.sourceCode(),
                language.getJudge0LanguageId(),
                requestDto.stdin()
        );

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.CODE_RUN_QUEUE,
                message
        );

        return sessionId;
    }
}