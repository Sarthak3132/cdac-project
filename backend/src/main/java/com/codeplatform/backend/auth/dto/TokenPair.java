package com.codeplatform.backend.auth.dto;

public record TokenPair(
        String accessToken,
        String refreshToken,
        UserInfo user
){}



