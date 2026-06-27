package com.codeplatform.backend.admin.controller;

import com.codeplatform.backend.common.dto.SuccessResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @GetMapping("/ping")
    public ResponseEntity<SuccessResponse<String>> ping() {
        return ResponseEntity.ok(
                SuccessResponse.<String>builder()
                        .message("Admin access confirmed")
                        .data("pong")
                        .status(200)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }
}