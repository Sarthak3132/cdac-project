package com.codeplatform.backend.tags;

import com.codeplatform.backend.tags.dto.TagResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TagMapper {
    TagResponse toDto(TagEntity tag);
    List<TagResponse> toTagList(List<TagEntity> tagList);
}
