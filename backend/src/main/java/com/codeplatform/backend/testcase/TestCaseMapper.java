package com.codeplatform.backend.testcase;

import com.codeplatform.backend.testcase.dto.CreateTestCaseRequest;
import com.codeplatform.backend.testcase.dto.TestCaseResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TestCaseMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "problem", ignore = true)
    TestCaseEntity toEntity(CreateTestCaseRequest request);

    TestCaseResponse toDto(TestCaseEntity entity);
}