package com.codeplatform.backend.auth;

import com.codeplatform.backend.auth.dto.*;
import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.exception.ResponseStatusException;
import com.codeplatform.backend.security.UserContext;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static com.codeplatform.backend.common.AppConstants.AUTH;

@RestController
@RequestMapping(AUTH)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthMapper authMapper;

    private static final int ACCESS_MAX_AGE = 15 * 60;          // 15 min
    private static final int REFRESH_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

    // ── helpers ──────────────────────────────────────────────────────────────

    private ResponseCookie buildAccessTokenCookie(String token) {
        return ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(true) // false for local HTTP development
                .sameSite("Lax")
                .path("/")
                .maxAge(ACCESS_MAX_AGE)
                .build();
    }

    private ResponseCookie buildRefreshTokenCookie(String token) {
        return ResponseCookie.from("refresh_token", token)
                .httpOnly(true)
                .secure(true)               // false for local HTTP development
                .sameSite("Lax")
                .path("/api/v1/auth/refresh")
                .maxAge(REFRESH_MAX_AGE)
                .build();
    }

    private String extractRefreshCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie c : request.getCookies()) {
            if ("refresh_token".equals(c.getName())) return c.getValue();
        }
        return null;
    }

    // ── endpoints ─────────────────────────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<SuccessResponse<?>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SuccessResponse.of("Registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<SuccessResponse<?>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        TokenPair pair = authService.login(request);
        return ResponseEntity.ok()
                .header("Set-Cookie", buildAccessTokenCookie(pair.accessToken()).toString())
                .header("Set-Cookie", buildRefreshTokenCookie(pair.refreshToken()).toString())
                .body(SuccessResponse.of("Login successful"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<SuccessResponse<Void>> refresh(HttpServletRequest request) {

        String rawRefresh = extractRefreshCookie(request);

        if (rawRefresh == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Refresh token missing"
            );
        }

        TokenPair pair = authService.refresh(rawRefresh);

        return ResponseEntity.ok()
                .header("Set-Cookie", buildAccessTokenCookie(pair.accessToken()).toString())
                .header("Set-Cookie", buildRefreshTokenCookie(pair.refreshToken()).toString())
                .body(SuccessResponse.of("Token refreshed", null));
    }

    @GetMapping("/me")
    public ResponseEntity<SuccessResponse<?>> me(
            @AuthenticationPrincipal UserContext user
    ) {
        UserInfo userInfo = authMapper.toDto(user);
        return ResponseEntity.ok().body(SuccessResponse.of("User info fetched successfully", userInfo));
    }

    @PostMapping("/logout")
    public ResponseEntity<SuccessResponse<?>> logout(HttpServletRequest request) {
        authService.logout(extractRefreshCookie(request));
        return ResponseEntity.ok()
                .header("Set-Cookie", clearAccessTokenCookie().toString())
                .header("Set-Cookie", clearRefreshTokenCookie().toString())
                .body(SuccessResponse.of("Logout successful"));
    }

    private ResponseCookie clearAccessTokenCookie() {
        return ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
    }

    private ResponseCookie clearRefreshTokenCookie() {
        return ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .path("/api/v1/auth/refresh")
                .maxAge(0)
                .build();
    }
}