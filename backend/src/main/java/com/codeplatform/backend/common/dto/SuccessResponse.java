package com.codeplatform.backend.common.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuccessResponse<T> {

    private String message;
    private T data;
    private int status;
    private long timestamp;
}