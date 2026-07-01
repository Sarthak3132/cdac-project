package com.codeplatform.backend.problem;

import com.codeplatform.backend.problem.dto.CreateProblemRequest;
import com.codeplatform.backend.problem.dto.ProblemInfo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProblemMapper {

    // author is set explicitly in the service from the authenticated UserContext,
    // never from the request body, so it's ignored here rather than left to guesswork.
    @Mapping(target = "author", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isPublished", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ProblemEntity toEntity(CreateProblemRequest dto);

    // NOTE: adjust "author.username" below to whatever the display-name field
    // is actually called on UserEntity (e.g. author.name / author.fullName).
    @Mapping(target = "authorId", source = "author.id")
    @Mapping(target = "authorName", source = "author.username")
    ProblemInfo toDto(ProblemEntity problemEntity);
}