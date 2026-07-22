package com.codeplatform.backend.testcase.dto;

import jakarta.validation.constraints.NotBlank;
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

    @NotBlank
    private String expectedOutput;
}
