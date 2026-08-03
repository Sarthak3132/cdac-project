package com.codeplatform.backend.testcase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTestCaseRequest {

    @NotBlank
    private String inputData;

    private String displayInput;

    @NotBlank
    private String expectedOutput;

    private String explanation;

    @NotNull
    private Boolean visible;
}