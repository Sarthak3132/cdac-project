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

    private String version;

    private String dockerImage;

    private String sourceFile;

    private String compileCommand;

    private String runCommand;

    private Boolean isCompiled;

    private Boolean enabled;
}