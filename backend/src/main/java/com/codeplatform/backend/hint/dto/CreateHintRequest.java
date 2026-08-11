package com.codeplatform.backend.hint.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateHintRequest {

    @NotBlank
    private String content;

    @NotNull
    private Integer displayOrder;

}