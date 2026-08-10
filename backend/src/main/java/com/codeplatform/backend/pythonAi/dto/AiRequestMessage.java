package com.codeplatform.backend.pythonAi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiRequestMessage {
    private String sessionId;
    private AiRequestType type;
    private String language;
    private String sourceCode;
    private String message;
    private List<ChatTurnDto> history;
    private Long problemId;
    private String problemTitle;
    private String problemDescription;
}