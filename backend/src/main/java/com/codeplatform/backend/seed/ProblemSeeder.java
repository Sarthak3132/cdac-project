package com.codeplatform.backend.seed;

import com.codeplatform.backend.problem.ProblemDifficulty;
import com.codeplatform.backend.problem.ProblemEntity;
import com.codeplatform.backend.problem.ProblemRepository;
import com.codeplatform.backend.tags.TagEntity;
import com.codeplatform.backend.tags.TagRepository;
import com.codeplatform.backend.user.UserEntity;
import com.codeplatform.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Profile("prod")
@Slf4j
@Order(3)
public class ProblemSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    @Override
    public void run(String... args) {
        // Must run after UserSeeder and TagSeeder.
        UserEntity author = userRepository.findByEmail("vishalborle71@example.com")
                .orElseThrow(() -> new IllegalStateException("Expected seeded admin user to exist"));

        List<ProblemSeed> problems = List.of(
                new ProblemSeed(
                        "Two Sum",
                        "two-sum",
                        "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.",
                        ProblemDifficulty.EASY,
                        1000,
                        65536,
                        List.of("Array", "Hash Table")
                ),
                new ProblemSeed(
                        "Valid Parentheses",
                        "valid-parentheses",
                        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if brackets are closed by the same type and in the correct order.",
                        ProblemDifficulty.EASY,
                        1000,
                        65536,
                        List.of("String", "Stack")
                ),
                new ProblemSeed(
                        "Longest Substring Without Repeating Characters",
                        "longest-substring-without-repeating-characters",
                        "Given a string s, find the length of the longest substring without repeating characters.",
                        ProblemDifficulty.MEDIUM,
                        1500,
                        65536,
                        List.of("String", "Two Pointers", "Hash Table")
                )
        );

        for (ProblemSeed seed : problems) {
            if (problemRepository.existsBySlug(seed.slug())) {
                continue;
            }

            Set<TagEntity> tags = new HashSet<>();
            for (String tagName : seed.tags()) {
                TagEntity tag = tagRepository.findByNameIgnoreCase(tagName)
                        .orElseThrow(() -> new IllegalStateException("Expected seeded tag '" + tagName + "' to exist"));
                tags.add(tag);
            }

            ProblemEntity problem = ProblemEntity.builder()
                    .author(author)
                    .title(seed.title())
                    .slug(seed.slug())
                    .description(seed.description())
                    .problemDifficulty(seed.difficulty())
                    .timeLimitMs(seed.timeLimitMs())
                    .memoryLimitKb(seed.memoryLimitKb())
                    .isPublished(true)
                    .tags(tags)
                    .build();
            problemRepository.save(problem);
        }

        log.info("Problems seeded successfully.");
    }

    private record ProblemSeed(
            String title,
            String slug,
            String description,
            ProblemDifficulty difficulty,
            int timeLimitMs,
            int memoryLimitKb,
            List<String> tags
    ) {
    }
}