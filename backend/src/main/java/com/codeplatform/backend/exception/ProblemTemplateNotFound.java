package com.codeplatform.backend.exception;
public class ProblemTemplateNotFound extends RuntimeException {
    public ProblemTemplateNotFound(String message) {
        super(message);
    }
}