package com.codeplatform.backend.problemtemplate.dto;

import com.codeplatform.backend.problemtemplate.ProblemTemplateEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TemplateDetailsResponse {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private Long languageId;
    private String languageName;
    private String starterCode;
    private String driverCode;

     public static TemplateDetailsResponse toDetailsResponse(ProblemTemplateEntity template) {
        return TemplateDetailsResponse.builder()
                .id(template.getId())
                .problemId(template.getProblem().getId())
                .problemTitle(template.getProblem().getTitle())
                .languageId(template.getLanguage().getId())
                .languageName(template.getLanguage().getName())
                .starterCode(template.getStarterCode())
                .driverCode(template.getDriverCode())
                .build();
    }
}
