package com.codeplatform.backend.submission;

import com.codeplatform.backend.submission.dto.SubmissionDetailDTO;
import com.codeplatform.backend.submission.dto.SubmissionListItemDTO;
import org.springframework.stereotype.Component;

@Component
public class SubmissionMapper {

    public SubmissionListItemDTO toListItem(SubmissionEntity e) {
        return new SubmissionListItemDTO(
                e.getId(),
                e.getVerdict(),
                e.getLanguage().getName(), // adjust to your actual LanguageEntity field (e.g. getCode())
                e.getCpuTimeMs(),
                e.getMemoryUsageKb(),
                e.getPassedTestcases(),
                e.getTotalTestcases(),
                e.getSubmittedAt()
        );
    }

    public SubmissionDetailDTO toDetail(SubmissionEntity e) {
        return new SubmissionDetailDTO(
                e.getId(),
                e.getVerdict(),
                e.getLanguage().getName(),
                e.getCpuTimeMs(),
                e.getMemoryUsageKb(),
                e.getCodeBody(),
                e.getTotalTestcases(),
                e.getPassedTestcases(),
                e.getFailureInput(),
                e.getExpectedOutput(),
                e.getActualOutput(),
                e.getDiagnosticMessage(),
                e.getSubmittedAt()
        );
    }
}