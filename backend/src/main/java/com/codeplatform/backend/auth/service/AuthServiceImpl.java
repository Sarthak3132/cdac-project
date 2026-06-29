package com.codeplatform.backend.auth.service;

import com.codeplatform.backend.auth.dto.response.AuthResponse;
import com.codeplatform.backend.auth.dto.request.LoginRequest;
import com.codeplatform.backend.auth.dto.request.RegisterRequest;
import com.codeplatform.backend.auth.mapper.AuthMapper;
import com.codeplatform.backend.security.JwtService;
import com.codeplatform.backend.security.UserContext;
import com.codeplatform.backend.user.entity.Role;
import com.codeplatform.backend.user.entity.User;
import com.codeplatform.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthMapper authMapper;

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        User user = authMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);



    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserContext userContext = (UserContext) authentication.getPrincipal();
        User user = userContext.user();

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUserName())
                .role(user.getRole().name())
                .build();
    }
}