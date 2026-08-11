package com.codeplatform.backend.seed;


import com.codeplatform.backend.user.UserEntity;
import com.codeplatform.backend.user.UserRepository;
import com.codeplatform.backend.user.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Profile("prod")
@Slf4j
@Order(1)
public class UserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        List<UserSeed> users = List.of(

                // ---------- ADMINS ----------
                new UserSeed(
                        "sarthak_mali",
                        "sarthakmali22@gmail.com",
                        UserRole.ADMIN
                ),
                new UserSeed(
                        "vishal_borle",
                        "vishalborle71@example.com",
                        UserRole.ADMIN
                ),
                new UserSeed(
                        "sarthak_kamble",
                        "kamlesarthak@gmail.com",
                        UserRole.ADMIN
                ),

                // ---------- NORMAL USERS ----------
                new UserSeed("user1", "user1@example.com", UserRole.USER),
                new UserSeed("user2", "user2@example.com", UserRole.USER),
                new UserSeed("user3", "user3@example.com", UserRole.USER),
                new UserSeed("user4", "user4@example.com", UserRole.USER),
                new UserSeed("user5", "user5@example.com", UserRole.USER),
                new UserSeed("user6", "user6@example.com", UserRole.USER),
                new UserSeed("user7", "user7@example.com", UserRole.USER),
                new UserSeed("user8", "user8@example.com", UserRole.USER),
                new UserSeed("user9", "user9@example.com", UserRole.USER),
                new UserSeed("user10", "user10@example.com", UserRole.USER)
        );

        for (UserSeed user : users) {

            if (userRepository.existsByEmail(user.email())) {
                continue;
            }

            UserEntity entity = UserEntity.builder()
                    .username(user.username())
                    .email(user.email())
                    .password(passwordEncoder.encode("password@123"))
                    .userRole(user.role())
                    .enabled(true)
                    .bio("Seeded User")
                    .profileImageUrl(null)
                    .build();

            userRepository.save(entity);
        }

        log.info("Users seeded successfully.");
    }

    private record UserSeed(
            String username,
            String email,
            UserRole role
    ) {
    }
}