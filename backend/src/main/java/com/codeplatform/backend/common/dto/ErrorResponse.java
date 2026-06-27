package com.codeplatform.backend.common.dto;


import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ErrorResponse {
    private  Integer status;
    private  String message;
    private  String error;
    private String path;
    private  LocalDateTime timestamp;
}
