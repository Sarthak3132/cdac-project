package com.codeplatform.backend.security;

import com.codeplatform.backend.user.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public record UserContext(UserEntity userEntity) implements UserDetails {

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + userEntity.getUserRole().name()));
    }

    @Override
    public String getPassword() {
        return userEntity.getPassword();
    }

    @Override
    public String getUsername() {
        return userEntity.getUsername();        // matches column: username
    }

    public String getEmail() {
        return userEntity.getEmail();
    }

    public Long getId() {
        return userEntity.getId();
    }

    public String getRole() {
        return userEntity.getUserRole().name();
    }

    @Override
    public boolean isAccountNonLocked() {
        return !userEntity.isLocked();          // uses Instant-based helper
    }

    @Override
    public boolean isEnabled() {
        return userEntity.isEnabled() && !userEntity.isDeleted(); // isDeleted() checks deletedAt != null
    }
}