package com.codeplatform.backend.pythonAi.dto;

import lombok.Data;

import java.util.List;

@Data
public class ChatRequest {
    private String sessionId;
    private String message;
    private List<ChatTurnDto> history;
    private String problemTitle;
    private String problemDescription;
    private String sourceCode;
    private String language;
}