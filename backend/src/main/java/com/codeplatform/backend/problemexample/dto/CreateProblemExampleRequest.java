package com.codeplatform.backend.problemexample.dto;

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
public class CreateProblemExampleRequest {

    @NotBlank
    private String inputData;

    @NotBlank
    private String outputData;

    private String explanation;

    @NotNull
    private Integer displayOrder;
}