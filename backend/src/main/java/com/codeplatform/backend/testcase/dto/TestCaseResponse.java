package com.codeplatform.backend.testcase.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCaseResponse {
    private Long id;
    private String inputData;
    private String displayInput;
    private String expectedOutput;
    private String explanation;
    private Boolean visible;
}