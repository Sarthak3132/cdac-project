package com.codeplatform.backend.problem;

import com.codeplatform.backend.problem.dto.CreateProblemRequest;
import com.codeplatform.backend.problem.dto.ProblemDetails;
import com.codeplatform.backend.problem.dto.ProblemSummary;
import com.codeplatform.backend.problem.dto.UpdateProblemRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProblemMapper {

    ProblemEntity toEntity(CreateProblemRequest dto);
    ProblemSummary toDto(ProblemEntity problemEntity);
    ProblemDetails toDetailsDto(ProblemEntity problemEntity);

}