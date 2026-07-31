package com.codeplatform.backend.codeexecution.dto;

import java.io.Serializable;

public record CodeRunMessage(
        String sessionId,
        String sourceCode,
        Integer judge0LanguageId,
        String stdin
) implements Serializable {}