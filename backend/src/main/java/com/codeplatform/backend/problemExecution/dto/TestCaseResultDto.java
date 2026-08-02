package com.codeplatform.backend.problemExecution.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestCaseResultDto {
    String testCaseId;
    String inputData;
    boolean passed;
    String actualOutput;
    String expectedOutput;
    String stderr;
    String statusDescription;
    Double time;
    Integer memory;
}
