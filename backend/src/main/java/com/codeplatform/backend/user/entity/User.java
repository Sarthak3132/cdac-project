package com.codeplatform.backend.user.entity;

import com.codeplatform.backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "users")
@Data
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;


    @Column(nullable = false, unique = true)
    private String userName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    // Soft delete
    @Column(nullable = false)
    private boolean deleted = false;

    // Account status
    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false)
    private boolean locked = false;
}