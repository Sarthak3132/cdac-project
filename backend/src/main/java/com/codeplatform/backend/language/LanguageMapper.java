package com.codeplatform.backend.language;

import com.codeplatform.backend.language.dto.CreateLanguageRequest;
import com.codeplatform.backend.language.dto.LanguageResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LanguageMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    LanguageEntity toEntity(CreateLanguageRequest request);

    LanguageResponse toDto(LanguageEntity entity);
}