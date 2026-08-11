package com.codeplatform.backend.tags.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TagResponse {

    private Long id;

    private String name;
}