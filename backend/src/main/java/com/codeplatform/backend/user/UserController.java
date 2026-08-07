package com.codeplatform.backend.user;

import com.codeplatform.backend.common.AppConstants;
import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.security.UserContext;
import com.codeplatform.backend.user.dto.UpdateUserRequest;
import com.codeplatform.backend.user.dto.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(AppConstants.USER)
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management endpoints")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<SuccessResponse<UserResponse>> getMe(
            @AuthenticationPrincipal UserContext user
    ) {

        UserEntity userEntity = userService.getUserById(user.getId());
        UserResponse response = userMapper.toResponse(userEntity);
        return ResponseEntity.ok(SuccessResponse.of("User profile fetched", response));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<SuccessResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserContext user,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        UserEntity updatedUser = userService.updateUser(user.getId(), request);
        UserResponse response = userMapper.toResponse(updatedUser);
        return ResponseEntity.ok(SuccessResponse.of("Profile updated successfully", response));
    }
}