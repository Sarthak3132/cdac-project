package com.codeplatform.backend.admin;

import com.codeplatform.backend.admin.dto.AdminAnalyticsDto;
import com.codeplatform.backend.common.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.codeplatform.backend.common.AppConstants.API_VERSION;

@RestController
@RequestMapping(API_VERSION + "/admin/analytics")
@RequiredArgsConstructor
@Tag(name = "Admin Analytics", description = "Analytics endpoints for admin dashboard")
public class AdminAnalyticsController {

    private final AdminAnalyticsService analyticsService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all analytics metrics for dashboard")
    public ResponseEntity<SuccessResponse<AdminAnalyticsDto>> getAnalytics() {
        AdminAnalyticsDto analytics = analyticsService.getAnalytics();
        return ResponseEntity.ok(SuccessResponse.of("Analytics fetched successfully", analytics));
    }
}