package com.codeplatform.backend.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsDto {
    private Long totalUsers;
    private Long activeUsersThisWeek;
    private Long newUsersThisMonth;
    private List<UserGrowthDto> userGrowthLast30Days;
    private Long totalSubmissions;
    private Long submissionsThisWeek;
}