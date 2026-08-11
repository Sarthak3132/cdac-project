package com.codeplatform.backend.submission.dto;

import com.codeplatform.backend.submission.SubmissionVerdict;
import java.time.Instant;

public record SubmissionDetailDTO(
        Long id,
        SubmissionVerdict verdict,
        String language,
        Integer cpuTimeMs,
        Integer memoryUsageKb,
        String codeBody,
        Integer totalTestcases,
        Integer passedTestcases,
        String failureInput,
        String expectedOutput,
        String actualOutput,
        String diagnosticMessage,
        Instant submittedAt
) {}