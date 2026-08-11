package com.codeplatform.backend.submission.dto;

import com.codeplatform.backend.submission.SubmissionVerdict;
import java.time.Instant;

public record SubmissionListItemDTO(
        Long id,
        SubmissionVerdict verdict,
        String language,
        Integer cpuTimeMs,
        Integer memoryUsageKb,
        Integer passedTestcases,
        Integer totalTestcases,
        Instant submittedAt
) {}