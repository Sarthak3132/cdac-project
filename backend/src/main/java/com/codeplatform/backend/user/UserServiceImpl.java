package com.codeplatform.backend.user;

import com.codeplatform.backend.exception.ConflictException;
import com.codeplatform.backend.exception.ResourceNotFoundException;
import com.codeplatform.backend.user.dto.UpdateUserRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public UserEntity getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("User not found with id: {}", id);
                    return new ResourceNotFoundException("User not found");
                });
    }

    @Override
    @Transactional(readOnly = true)
    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("User not found with email: {}", email);
                    return new ResourceNotFoundException("User not found");
                });
    }

    @Override
    public UserEntity updateUser(Long userId, UpdateUserRequest request) {
        UserEntity user = getUserById(userId);

        // If username is being changed, check if new username is already taken
        if (request.getUsername() != null &&
                !request.getUsername().equals(user.getUsername())) {
            if (isUsernameTaken(request.getUsername(), userId)) {
                log.warn("Username already taken: {}", request.getUsername());
                throw new ConflictException("Username already taken");
            }
        }

        // Update fields
        userMapper.updateUserFromRequest(request, user);

        log.info("User updated: {}", userId);
        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUsernameTaken(String username, Long excludeUserId) {
        return userRepository.findByUsername(username)
                .map(user -> !user.getId().equals(excludeUserId))
                .orElse(false);
    }
}