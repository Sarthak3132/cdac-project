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
public class UserManagementResponse {

    private Long id;
    private String username;
    private String email;
    private UserRole userRole;
    private boolean enabled;
    private Instant lockUntil;
    private Instant createdAt;
    private Instant deletedAt;
}