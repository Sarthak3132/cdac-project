package com.codeplatform.backend.exception;

public class ProblemTemplateNotFound extends ResourceNotFoundException {
    public ProblemTemplateNotFound(String message) {
        super(message);
    }
}