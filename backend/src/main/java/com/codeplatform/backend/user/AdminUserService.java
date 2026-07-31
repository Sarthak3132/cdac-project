package com.codeplatform.backend.user;

import com.codeplatform.backend.user.dto.UserManagementResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {

    Page<UserManagementResponse> getAllUsers(String search, Pageable pageable);

    UserManagementResponse blockUser(Long userId);

    UserManagementResponse unblockUser(Long userId);

    void deleteUser(Long userId, Long currentUserId);
}