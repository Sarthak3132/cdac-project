package com.codeplatform.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base type for all application-level exceptions.
 * Every subclass carries the HTTP status it should map to,
 * so GlobalExceptionHandler can turn any of them into a
 * consistent ErrorResponse without per-exception wiring.
 */
@Getter
public  class AppException extends RuntimeException {

    private final HttpStatus status;

    public AppException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
}