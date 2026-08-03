package com.codeplatform.backend.language.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateLanguageRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String shortName;

    @NotBlank
    private String fileExtension;

    @NotBlank
    private String version;

    @NotNull
    private Integer judge0LanguageId;

    private Boolean enabled;
}