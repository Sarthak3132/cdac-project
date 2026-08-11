package com.codeplatform.backend.common;

public record SuccessResponse<T>(
        String message,
        T data
) {

    public static SuccessResponse<Void> of(String message) {
        return new SuccessResponse<>(message, null);
    }

    public static <T> SuccessResponse<T> of(String message, T data) {
        return new SuccessResponse<>(message, data);
    }
}