package com.codeplatform.backend.problemtemplate;

import com.codeplatform.backend.problemtemplate.dto.ProblemTemplateResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")
public interface ProblemTemplateMapper {
    @Mapping(target = "problemId", source = "problem.id")
    @Mapping(target = "problemTitle", source = "problem.title")
    @Mapping(target = "languageId", source = "language.id")
    @Mapping(target = "languageName", source = "language.name")
    ProblemTemplateResponse toDto(ProblemTemplateEntity entity);
}