package com.codeplatform.backend.auth;


import com.codeplatform.backend.auth.dto.RegisterRequest;
import com.codeplatform.backend.auth.dto.UserInfo;
import com.codeplatform.backend.security.UserContext;
import com.codeplatform.backend.user.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthMapper {
    @Mapping(target = "username", source = "userName")
    UserEntity toEntity(RegisterRequest dto);
    UserInfo toDto(UserContext userContext);
}
