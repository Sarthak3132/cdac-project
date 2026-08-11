package com.codeplatform.backend.pythonAi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiResultMessage {
    private String sessionId;
    private AiRequestType type;
    private String content;
    private String error;
}