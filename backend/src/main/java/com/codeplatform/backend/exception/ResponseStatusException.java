package com.codeplatform.backend.exception;

import org.springframework.http.HttpStatus;

public class ResponseStatusException extends RuntimeException {
    HttpStatus status;

    public ResponseStatusException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}
