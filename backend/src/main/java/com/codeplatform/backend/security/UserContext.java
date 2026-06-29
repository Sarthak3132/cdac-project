package com.codeplatform.backend.security;

import com.codeplatform.backend.user.entity.User;
import jakarta.websocket.OnError;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public record UserContext(User user) implements UserDetails {

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUserName();
    }

    public String getEmail(){
        return  user.getEmail();
    }

    public Long getId(){
        return user.getId();
    }

    @Override
    public boolean isAccountNonLocked() {
        return !user.isLocked();
    }

    public String getRole(){
        return user.getRole().name();
    }

    @Override
    public boolean isEnabled() {
        return user.isEnabled() && !user.isDeleted();
    }
}