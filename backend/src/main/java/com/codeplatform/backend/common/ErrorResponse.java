package com.codeplatform.backend.common;

public record ErrorResponse(
        String message,
        String path
) {

    public static ErrorResponse of(String message, String path) {
        return new ErrorResponse(message, path);
    }
}