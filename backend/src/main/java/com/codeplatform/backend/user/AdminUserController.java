package com.codeplatform.backend.user;

import com.codeplatform.backend.common.AppConstants;
import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.security.UserContext;
import com.codeplatform.backend.user.dto.UserManagementResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(AppConstants.ADMIN + "/users")
@RequiredArgsConstructor
@Tag(name = "Admin Users", description = "Admin user management endpoints")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    @Operation(summary = "Get all users with pagination and optional search")
    public ResponseEntity<SuccessResponse<Page<UserManagementResponse>>> getAllUsers(
            @Parameter(description = "Search by username or email")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        Page<UserManagementResponse> users = adminUserService.getAllUsers(search, pageable);
        return ResponseEntity.ok(SuccessResponse.of("Users fetched successfully", users));
    }

    @PatchMapping("/{id}/block")
    @Operation(summary = "Block a user")
    public ResponseEntity<SuccessResponse<UserManagementResponse>> blockUser(
            @Parameter(description = "User ID")
            @PathVariable Long id
    ) {
        UserManagementResponse response = adminUserService.blockUser(id);
        return ResponseEntity.ok(SuccessResponse.of("User blocked successfully", response));
    }

    @PatchMapping("/{id}/unblock")
    @Operation(summary = "Unblock a user")
    public ResponseEntity<SuccessResponse<UserManagementResponse>> unblockUser(
            @Parameter(description = "User ID")
            @PathVariable Long id
    ) {
        UserManagementResponse response = adminUserService.unblockUser(id);
        return ResponseEntity.ok(SuccessResponse.of("User unblocked successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete a user")
    public ResponseEntity<SuccessResponse<Void>> deleteUser(
            @Parameter(description = "User ID")
            @PathVariable Long id,
            @AuthenticationPrincipal UserContext currentUser
    ) {
        adminUserService.deleteUser(id, currentUser.getId());
        return ResponseEntity.ok(SuccessResponse.of("User deleted successfully", null));
    }
}