package com.codeplatform.backend.common.dto;


import lombok.Builder;

import java.time.Instant;
import java.util.List;

@Builder
public class ErrorResponse {
    Instant timestamp;
    int status;
    String error;
    String message;
    String path;
    List<String> details;
}
