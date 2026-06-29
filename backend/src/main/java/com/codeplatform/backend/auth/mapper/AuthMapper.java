package com.codeplatform.backend.auth.mapper;


import com.codeplatform.backend.auth.dto.request.RegisterRequest;
import com.codeplatform.backend.user.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuthMapper {
    User toEntity(RegisterRequest dto);
}
