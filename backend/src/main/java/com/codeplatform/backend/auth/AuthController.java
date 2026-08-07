package com.codeplatform.backend.auth;

import com.codeplatform.backend.auth.dto.*;
import com.codeplatform.backend.common.AppConstants;
import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.exception.AppException;
import com.codeplatform.backend.security.UserContext;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping(AppConstants.AUTH)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthMapper authMapper;

    private static final String ACCESS_TOKEN = "access_token";
    private static final String REFRESH_TOKEN = "refresh_token";

    private static final int ACCESS_MAX_AGE = 15*  60;
    private static final int REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private ResponseCookie buildCookie(String name, String value, String path, int maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true)      // false for local development
                .sameSite("Lax")
                .path(path)
                .maxAge(maxAge)
                .build();
    }

    private String getCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) {
            return null;
        }

        for (Cookie cookie : request.getCookies()) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Endpoints
    // -------------------------------------------------------------------------

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
                .header("Set-Cookie",
                        buildCookie(ACCESS_TOKEN, pair.accessToken(), "/", ACCESS_MAX_AGE).toString())
                .header("Set-Cookie",
                        buildCookie(REFRESH_TOKEN, pair.refreshToken(),
                                "/api/v1/auth/refresh", REFRESH_MAX_AGE).toString())
                .body(SuccessResponse.of("Login successful"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<SuccessResponse<Void>> refresh(HttpServletRequest request) {

        String refreshToken = getCookie(request, REFRESH_TOKEN);

        log.info("Refresh token received: {}", refreshToken);

        if (refreshToken == null) {
            throw new AppException(
                    "Refresh token missing",
                    HttpStatus.UNAUTHORIZED
            );
        }

        TokenPair pair = authService.refresh(refreshToken);

        return ResponseEntity.ok()
                .header("Set-Cookie",
                        buildCookie(ACCESS_TOKEN, pair.accessToken(), "/", ACCESS_MAX_AGE).toString())
                .header("Set-Cookie",
                        buildCookie(REFRESH_TOKEN, pair.refreshToken(),
                                "/api/v1/auth/refresh", REFRESH_MAX_AGE).toString())
                .body(SuccessResponse.of("Token refreshed", null));
    }

    @GetMapping("/me")
    public ResponseEntity<SuccessResponse<?>> me(
            @AuthenticationPrincipal UserContext user
    ) {
        return ResponseEntity.ok(
                SuccessResponse.of(
                        "User info fetched successfully",
                        authMapper.toDto(user)
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<SuccessResponse<?>> logout(HttpServletRequest request) {

        authService.logout(getCookie(request, REFRESH_TOKEN));

        return ResponseEntity.ok()
                .header("Set-Cookie",
                        buildCookie(ACCESS_TOKEN, "", "/", 0).toString())
                .header("Set-Cookie",
                        buildCookie(REFRESH_TOKEN, "",
                                "/api/v1/auth/refresh", 0).toString())
                .body(SuccessResponse.of("Logout successful"));
    }
}