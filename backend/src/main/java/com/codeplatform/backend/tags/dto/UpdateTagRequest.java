package com.codeplatform.backend.tags.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTagRequest {

    @NotBlank
    private String name;
}
