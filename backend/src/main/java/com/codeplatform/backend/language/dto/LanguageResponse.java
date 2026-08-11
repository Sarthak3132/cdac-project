package com.codeplatform.backend.language.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageResponse {

    private Long id;

    private String name;

    private String shortName;

    private String fileExtension;

    private String version;

    private Integer judge0LanguageId;

    private Boolean enabled;
}