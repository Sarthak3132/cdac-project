package com.codeplatform.backend.auth.controller;

import com.codeplatform.backend.auth.dto.request.LoginRequest;
import com.codeplatform.backend.auth.dto.request.RegisterRequest;
import com.codeplatform.backend.auth.dto.response.AuthResponse;
import com.codeplatform.backend.auth.service.AuthService;
import com.codeplatform.backend.common.dto.SuccessResponse;
import com.codeplatform.backend.security.UserContext;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

import static com.codeplatform.backend.common.constant.AppConstants.AUTH;

@RestController
@RequestMapping(AUTH)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<SuccessResponse<String>> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        SuccessResponse.<String>builder()
                                .message("Registration successful")
                                .data("User registered successfully. Please login.")
                                .status(HttpStatus.CREATED.value())
                                .timestamp(LocalDateTime.now())
                                .build()
                );
    }

    @PostMapping("/login")
    public ResponseEntity<SuccessResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {

        AuthResponse authResponse = authService.login(request);

        ResponseCookie cookie = ResponseCookie.from("token", authResponse.getToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(24 * 60 * 60)
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(
                        SuccessResponse.<AuthResponse>builder()
                                .message("Login successful")
                                .data(authResponse)
                                .status(HttpStatus.OK.value())
                                .timestamp(LocalDateTime.now())
                                .build()
                );
    }

    @GetMapping("/me")
    public ResponseEntity<SuccessResponse<AuthResponse>> me(
            @AuthenticationPrincipal UserContext user
    ) {
        String info = "Logged in as: " + user.getUsername()
                + " | Role: " + user.user().getRole();



        AuthResponse authData = AuthResponse.builder().id(user.getId()).email(user.getEmail()).role(user.getRole()).username(user.getUsername()).build();

        return ResponseEntity.ok(
                SuccessResponse.<AuthResponse>builder()
                        .message(info)
                        .data(authData)
                        .status(HttpStatus.OK.value())
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }
    @PostMapping("/logout")
    public ResponseEntity<SuccessResponse<String>> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.ok(
                SuccessResponse.<String>builder()
                        .message("Logout successful")
                        .data(null)
                        .status(200)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }
}