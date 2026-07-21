package com.codeplatform.backend.exception;

import org.springframework.http.HttpStatus;

public class TestCaseNotFound extends AppException {
    public TestCaseNotFound(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
