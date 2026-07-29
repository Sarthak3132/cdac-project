package com.codeplatform.backend.user.dto;

import com.codeplatform.backend.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String bio;
    private String profileImageUrl;
    private UserRole role;
    private boolean enabled;
    private Instant createdAt;
    private Instant updatedAt;
}