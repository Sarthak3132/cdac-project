package com.codeplatform.backend.user;

import com.codeplatform.backend.user.dto.UpdateUserRequest;

public interface UserService {

    /**
     * Get user by ID
     */
    UserEntity getUserById(Long id);

    /**
     * Get user by email
     */
    UserEntity getUserByEmail(String email);

    /**
     * Update user profile (username, bio, profileImageUrl)
     */
    UserEntity updateUser(Long userId, UpdateUserRequest request);

    /**
     * Check if username is already taken by another user
     */
    boolean isUsernameTaken(String username, Long excludeUserId);
}