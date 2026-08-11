package com.codeplatform.backend.exception;


public class LanguageNotFound extends ResourceNotFoundException {
    public LanguageNotFound(String message) {
        super(message);
    }
}
