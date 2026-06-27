package com.codeplatform.backend.auth.service;

import com.codeplatform.backend.auth.dto.response.AuthResponse;
import com.codeplatform.backend.auth.dto.request.LoginRequest;
import com.codeplatform.backend.auth.dto.request.RegisterRequest;

public interface AuthService {
    void register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}