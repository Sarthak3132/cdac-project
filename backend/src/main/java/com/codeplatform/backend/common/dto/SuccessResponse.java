package com.codeplatform.backend.common.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
public class SuccessResponse<T> {
    private String message;
    private T data;
    private Integer status;
    private LocalDateTime timestamp;
}