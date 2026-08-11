package com.codeplatform.backend.hint.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HintResponse {

    private Long id;

    private String content;

    private Integer displayOrder;

}