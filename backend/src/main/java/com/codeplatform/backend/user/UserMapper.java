package com.codeplatform.backend.user;

import com.codeplatform.backend.user.dto.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(UserEntity user);

    void updateUserFromRequest(
            com.codeplatform.backend.user.dto.UpdateUserRequest request,
            @MappingTarget UserEntity user
    );
}