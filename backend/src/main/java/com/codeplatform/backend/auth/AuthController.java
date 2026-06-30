package com.codeplatform.backend.auth;

import com.codeplatform.backend.auth.dto.LoginRequest;
import com.codeplatform.backend.auth.dto.RegisterRequest;
import com.codeplatform.backend.auth.dto.UserInfo;
import com.codeplatform.backend.auth.dto.TokenPair;

import com.codeplatform.backend.common.SuccessResponse;
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

    private static final int ACCESS_MAX_AGE  = 15 * 60;          // 15 min
    private static final int REFRESH_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

    // ── helpers ──────────────────────────────────────────────────────────────

    private ResponseCookie buildCookie(String name, String value, int maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(maxAge)
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
                .header("Set-Cookie", buildCookie("access_token", pair.accessToken(), ACCESS_MAX_AGE).toString())
                .header("Set-Cookie", buildCookie("refresh_token", pair.refreshToken(), REFRESH_MAX_AGE).toString())
                .body(SuccessResponse.of("Login successful"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<SuccessResponse<Void>> refresh(HttpServletRequest request) {
        String rawRefresh = extractRefreshCookie(request);
        TokenPair pair = authService.refresh(rawRefresh);
        return ResponseEntity.ok()
                .header("Set-Cookie", buildCookie("access_token", pair.accessToken(), ACCESS_MAX_AGE).toString())
                .header("Set-Cookie", buildCookie("refresh_token", pair.refreshToken(), REFRESH_MAX_AGE).toString())
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
                .header("Set-Cookie", buildCookie("access_token", "", 0).toString())
                .header("Set-Cookie", buildCookie("refresh_token", "", 0).toString())
                .body(SuccessResponse.of("Logout successful"));
    }
}