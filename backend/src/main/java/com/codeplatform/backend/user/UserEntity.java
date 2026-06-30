package com.codeplatform.backend.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole userRole = UserRole.USER;

    @Column(nullable = false)
    private boolean enabled = true;

    // null = not locked; future timestamp = locked until that time
    @Column(name = "lock_until")
    private Instant lockUntil;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // Soft delete — null means not deleted
    @Column(name = "deleted_at")
    private Instant deletedAt;

    // ── helpers ────────────────────────────────────────────────────────────

    public boolean isDeleted() {
        return deletedAt != null;
    }

    public boolean isLocked() {
        return lockUntil != null && lockUntil.isAfter(Instant.now());
    }
}