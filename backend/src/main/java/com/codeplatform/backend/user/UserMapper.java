package com.codeplatform.backend.user;

import com.codeplatform.backend.user.dto.UpdateUserRequest;
import com.codeplatform.backend.user.dto.UserManagementResponse;
import com.codeplatform.backend.user.dto.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(UserEntity user);

    UserManagementResponse toManagementResponse(UserEntity user);

    void updateUserFromRequest(
            UpdateUserRequest request,
            @MappingTarget UserEntity user
    );
}