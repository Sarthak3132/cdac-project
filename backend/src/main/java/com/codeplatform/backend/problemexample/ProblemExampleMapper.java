package com.codeplatform.backend.problemexample;

import com.codeplatform.backend.problemexample.dto.CreateProblemExampleRequest;
import com.codeplatform.backend.problemexample.dto.ProblemExampleResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProblemExampleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "problem", ignore = true)
    ProblemExampleEntity toEntity(CreateProblemExampleRequest request);

    ProblemExampleResponse toDto(ProblemExampleEntity entity);

}
