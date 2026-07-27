package com.codeplatform.backend.auth;


import com.codeplatform.backend.auth.dto.RegisterRequest;
import com.codeplatform.backend.auth.dto.UserInfo;
import com.codeplatform.backend.security.UserContext;
import com.codeplatform.backend.user.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuthMapper {
    UserEntity toEntity(RegisterRequest dto);
    UserInfo toDto(UserContext userContext);
}
