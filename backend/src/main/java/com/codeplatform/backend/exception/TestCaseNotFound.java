package com.codeplatform.backend.exception;


public class TestCaseNotFound extends ResourceNotFoundException {
    public TestCaseNotFound(String message) {
        super(message);
    }
}
