package com.codeplatform.backend.problemtemplate.dto;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class UpdateProblemTemplateRequest {
    // Both optional - only non-null fields get applied (same patch-style as UpdateProblemRequest).
    // Problem/language associations are intentionally not editable here - delete and recreate instead.
    private String starterCode;
    private String driverCode;
}