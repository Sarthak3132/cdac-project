package com.codeplatform.backend.problemexample.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemExampleResponse {

    private Long id;

    private String inputData;

    private String outputData;

    private String explanation;

    private Integer displayOrder;
}
