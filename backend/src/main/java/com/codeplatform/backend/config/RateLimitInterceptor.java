package com.codeplatform.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final int DEFAULT_LIMIT = 60;
    private static final long DEFAULT_WINDOW_SECONDS = 60;

    private static final int EXECUTION_LIMIT = 1;
    private static final long EXECUTION_WINDOW_SECONDS = 3;

    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String uri = request.getRequestURI();
        boolean isExecutionEndpoint = uri.endsWith("/run") || uri.endsWith("/submit");

        int limit = isExecutionEndpoint ? EXECUTION_LIMIT : DEFAULT_LIMIT;
        long windowSeconds = isExecutionEndpoint ? EXECUTION_WINDOW_SECONDS : DEFAULT_WINDOW_SECONDS;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String identifier = (auth != null && auth.isAuthenticated())
                ? auth.getName()
                : request.getRemoteAddr();

        String key = "rate_limit:" + uri + ":" + identifier;

        Long count = redisTemplate.opsForValue().increment(key);

        if (count != null && count == 1) {
            redisTemplate.expire(key, windowSeconds, TimeUnit.SECONDS);
        }

        if (count != null && count > limit) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"message\":\"Too many requests, slow down.\"}");
            return false;
        }

        return true;
    }
}