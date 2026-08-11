package com.codeplatform.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final int DEFAULT_LIMIT = 60;
    private static final long DEFAULT_WINDOW_SECONDS = 60;

    private static final int EXECUTION_LIMIT = 1;
    private static final long EXECUTION_WINDOW_SECONDS = 3;

    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        String uri = request.getRequestURI();
        boolean isExecutionEndpoint = uri.endsWith("/run") || uri.endsWith("/submit");

        int limit = isExecutionEndpoint ? EXECUTION_LIMIT : DEFAULT_LIMIT;
        long windowSeconds = isExecutionEndpoint ? EXECUTION_WINDOW_SECONDS : DEFAULT_WINDOW_SECONDS;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String identifier = (auth != null && auth.isAuthenticated())
                ? auth.getName()
                : request.getRemoteAddr();

        String key = "rate_limit:" + uri + ":" + identifier;

        try {
            Long count = redisTemplate.opsForValue().increment(key);

            if (count != null && count == 1) {
                redisTemplate.expire(key, windowSeconds, TimeUnit.SECONDS);
            }

            if (count != null && count > limit) {
                response.setStatus(429);
                response.setContentType("application/json");
                try {
                    response.getWriter().write("{\"success\":false,\"message\":\"Too many requests, slow down.\"}");
                } catch (IOException ioEx) {
                    log.warn("Failed to write 429 response body for uri={}", uri, ioEx);
                }
                return false;
            }

            return true;

        } catch (Exception ex) {
            // Redis down/unreachable/erroring -> fail open, never block traffic
            log.warn("Rate limiter: Redis call failed, allowing request without limiting. uri={}, error={}",
                    uri, ex.getMessage());
            return true;
        }
    }
}