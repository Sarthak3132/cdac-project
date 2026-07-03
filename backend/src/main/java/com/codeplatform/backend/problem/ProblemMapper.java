package com.codeplatform.backend.problem;

import com.codeplatform.backend.problem.dto.CreateProblemRequest;
import com.codeplatform.backend.problem.dto.ProblemDetails;
import com.codeplatform.backend.problem.dto.ProblemSummary;
import com.codeplatform.backend.tags.TagEntity;
import com.codeplatform.backend.tags.dto.TagResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProblemMapper {

    ProblemEntity toEntity(CreateProblemRequest dto);

    ProblemSummary toDto(ProblemEntity entity);

    ProblemDetails toDetailsDto(ProblemEntity entity);

    TagResponse toTagResponse(TagEntity entity);
}