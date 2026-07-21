package com.codeplatform.backend.hint;

import com.codeplatform.backend.hint.dto.CreateHintRequest;
import com.codeplatform.backend.hint.dto.HintResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HintMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "problem", ignore = true)
    HintEntity toEntity(CreateHintRequest request);

    HintResponse toDto(HintEntity entity);

}