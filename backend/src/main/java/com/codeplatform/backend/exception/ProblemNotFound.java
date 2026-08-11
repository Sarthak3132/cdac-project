package com.codeplatform.backend.exception;


/**
 * Kept as a distinct type (rather than reusing ResourceNotFoundException directly)
 * in case problem-specific handling is ever needed, but it now plugs into the
 * same AppException -> GlobalExceptionHandler pipeline as every other error.
 */
public class ProblemNotFound extends ResourceNotFoundException {

    public ProblemNotFound(String message) {
        super(message);
    }
}