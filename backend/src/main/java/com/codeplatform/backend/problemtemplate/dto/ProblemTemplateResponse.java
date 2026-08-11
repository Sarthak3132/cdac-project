package com.codeplatform.backend.problemtemplate.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Builder
public class ProblemTemplateResponse {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private Long languageId;
    private String languageName;
    private String starterCode;
}
