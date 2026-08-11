package com.codeplatform.backend.submission.dto;


public record LeaderboardEntryDTO(
        int rank,
        Long userId,
        String username,
        long problemsSolved
) {
}