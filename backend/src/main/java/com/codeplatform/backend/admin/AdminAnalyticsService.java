package com.codeplatform.backend.admin;

import com.codeplatform.backend.admin.dto.AdminAnalyticsDto;
import com.codeplatform.backend.admin.dto.UserGrowthDto;
import com.codeplatform.backend.submission.SubmissionRepository;
import com.codeplatform.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AdminAnalyticsService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    public Long getTotalUsersCount() {
        return userRepository.countTotalUsers();
    }

    public Long getActiveUsersThisWeek() {
        Instant sevenDaysAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        return userRepository.countActiveUsersThisWeek(sevenDaysAgo);
    }

    public Long getNewUsersThisMonth() {
        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
        return userRepository.countNewUsersLastMonth(thirtyDaysAgo);
    }

    public List<UserGrowthDto> getUserGrowthLast30Days() {
        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
        return userRepository.getUserGrowthLast30Days(thirtyDaysAgo);
    }

    public Long getTotalSubmissionsCount() {
        return submissionRepository.countTotalSubmissions();
    }

    public Long getSubmissionsThisWeek() {
        return submissionRepository.countSubmissionsThisWeek();
    }

    public AdminAnalyticsDto getAnalytics() {
        log.info("Fetching analytics data");

        return AdminAnalyticsDto.builder()
                .totalUsers(getTotalUsersCount())
                .activeUsersThisWeek(getActiveUsersThisWeek())
                .newUsersThisMonth(getNewUsersThisMonth())
                .userGrowthLast30Days(getUserGrowthLast30Days())
                .totalSubmissions(getTotalSubmissionsCount())
                .submissionsThisWeek(getSubmissionsThisWeek())
                .build();
    }
}