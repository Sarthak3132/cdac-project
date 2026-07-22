package com.codeplatform.backend.testcase.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCaseResponse {

    private Long id;

    private String inputData;

    private String expectedOutput;

    private Boolean hidden;
}
