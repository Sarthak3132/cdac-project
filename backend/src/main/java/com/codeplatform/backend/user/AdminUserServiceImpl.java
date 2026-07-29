package com.codeplatform.backend.user;

import com.codeplatform.backend.exception.BadRequestException;
import com.codeplatform.backend.exception.ResourceNotFoundException;
import com.codeplatform.backend.user.dto.UserManagementResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<UserManagementResponse> getAllUsers(String search, Pageable pageable) {
        return userRepository.searchUsers(search, pageable)
                .map(userMapper::toManagementResponse);
    }

    @Override
    public UserManagementResponse blockUser(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found for block: {}", userId);
                    return new ResourceNotFoundException("User not found");
                });

        if (user.getDeletedAt() != null) {
            throw new BadRequestException("User is already deleted");
        }
        user.setLockUntil(Instant.now().plus(30, ChronoUnit.DAYS));

        UserEntity savedUser = userRepository.save(user);
        log.info("User blocked: {}", userId);

        return userMapper.toManagementResponse(savedUser);
    }

    @Override
    public UserManagementResponse unblockUser(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found for unblock: {}", userId);
                    return new ResourceNotFoundException("User not found");
                });

        if (user.getDeletedAt() != null) {
            throw new BadRequestException("User is already deleted");
        }

        user.setLockUntil(null);

        UserEntity savedUser = userRepository.save(user);
        log.info("User unblocked: {}", userId);

        return userMapper.toManagementResponse(savedUser);
    }

    @Override
    public void deleteUser(Long userId, Long currentUserId) {
        if (userId.equals(currentUserId)) {
            log.warn("Admin attempted to delete own account: {}", userId);
            throw new BadRequestException("You cannot delete your own account");
        }

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found for delete: {}", userId);
                    return new ResourceNotFoundException("User not found");
                });

        if (user.getDeletedAt() != null) {
            throw new BadRequestException("User is already deleted");
        }

        user.setDeletedAt(Instant.now());
        userRepository.save(user);

        log.info("User soft deleted: {}", userId);
    }
}