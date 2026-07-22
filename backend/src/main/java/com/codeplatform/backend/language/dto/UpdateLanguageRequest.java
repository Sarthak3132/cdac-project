package com.codeplatform.backend.language.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateLanguageRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String version;

    @NotBlank
    private String dockerImage;

    @NotBlank
    private String sourceFile;

    private String compileCommand;

    @NotBlank
    private String runCommand;

    private Boolean isCompiled;

    private Boolean enabled;
}