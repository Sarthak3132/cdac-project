package com.codeplatform.backend.auth;

import com.codeplatform.backend.auth.dto.LoginRequest;
import com.codeplatform.backend.auth.dto.RegisterRequest;
import com.codeplatform.backend.auth.dto.TokenPair;
import com.codeplatform.backend.auth.dto.UserInfo;
import com.codeplatform.backend.auth.refreshtoken.RefreshTokenEntity;
import com.codeplatform.backend.auth.refreshtoken.RefreshTokenService;
import com.codeplatform.backend.security.JwtService;
import com.codeplatform.backend.security.UserContext;
import com.codeplatform.backend.user.UserEntity;
import com.codeplatform.backend.user.UserRole;
import com.codeplatform.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService  {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthMapper authMapper;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        UserEntity userEntity = authMapper.toEntity(request);
        userEntity.setUserRole(UserRole.USER);
        userEntity.setEnabled(true);
        userEntity.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(userEntity);
    }

    @Transactional
    public TokenPair login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserContext userContext = (UserContext) authentication.getPrincipal();
        UserEntity userEntity = userContext.userEntity();

        // Revoke any existing refresh tokens for this userEntity (single session)
        refreshTokenService.revokeAllForUser(userEntity);

        String accessToken = jwtService.generateAccessToken(userEntity.getEmail(), userEntity.getUserRole().name());
        String rawRefreshToken = jwtService.generateOpaqueRefreshToken();
        refreshTokenService.save(rawRefreshToken, userEntity);



        UserInfo userInfo = UserInfo.builder()
                .id(userEntity.getId())
                .email(userEntity.getEmail())
                .username(userEntity.getUsername())
                .role(userEntity.getUserRole().name())
                .build();

        return new TokenPair(accessToken, rawRefreshToken, userInfo);
    }

    @Transactional
    public TokenPair refresh(String rawRefreshToken) {
        RefreshTokenEntity storedToken = refreshTokenService.validateAndGet(rawRefreshToken);
        UserEntity userEntity = storedToken.getUserEntity();

        // Rotate: revoke old, issue new
        storedToken.setRevoked(true);

        String newAccessToken = jwtService.generateAccessToken(userEntity.getEmail(), userEntity.getUserRole().name());
        String newRawRefreshToken = jwtService.generateOpaqueRefreshToken();
        refreshTokenService.save(newRawRefreshToken, userEntity);

        UserInfo userInfo = UserInfo.builder()
                .id(userEntity.getId())
                .email(userEntity.getEmail())
                .username(userEntity.getUsername())
                .role(userEntity.getUserRole().name())
                .build();

        return new TokenPair(newAccessToken, newRawRefreshToken, userInfo);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken != null) {
            refreshTokenService.revokeToken(rawRefreshToken);
        }
    }
}