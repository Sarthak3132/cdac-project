package com.codeplatform.backend.seed;

import com.codeplatform.backend.hint.HintEntity;
import com.codeplatform.backend.hint.HintRepository;
import com.codeplatform.backend.problem.ProblemEntity;
import com.codeplatform.backend.problem.ProblemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Profile("dev")
@Slf4j
@Order(3)
public class HintSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;
    private final HintRepository hintRepository;

    @Override
    public void run(String... args) {
        // Must run after ProblemSeeder — looks problems up by slug to get their generated id.
        Map<String, List<HintSeed>> hintsBySlug = Map.of(
                "two-sum", List.of(
                        new HintSeed("A brute-force approach checks every pair, which takes O(n^2) time.", 1),
                        new HintSeed("Can you use a hash map to check for the complement of the current number in one pass?", 2)
                ),
                "valid-parentheses", List.of(
                        new HintSeed("Use a stack to keep track of opening brackets.", 1),
                        new HintSeed("When you see a closing bracket, check if it matches the top of the stack.", 2)
                ),
                "longest-substring-without-repeating-characters", List.of(
                        new HintSeed("Use a sliding window with two pointers over the string.", 1),
                        new HintSeed("Track the last seen index of each character to shrink the window efficiently.", 2)
                )
        );

        for (Map.Entry<String, List<HintSeed>> entry : hintsBySlug.entrySet()) {
            ProblemEntity problem = problemRepository.findBySlug(entry.getKey())
                    .orElseThrow(() -> new IllegalStateException("Expected seeded problem '" + entry.getKey() + "' to exist"));

            if (!hintRepository.findByProblemIdOrderByDisplayOrderAsc(problem.getId()).isEmpty()) {
                continue;
            }

            for (HintSeed hint : entry.getValue()) {
                hintRepository.save(
                        HintEntity.builder()
                                .problem(problem)
                                .content(hint.content())
                                .displayOrder(hint.order())
                                .build()
                );
            }
        }

        log.info("Hints seeded successfully.");
    }

    private record HintSeed(String content, int order) {
    }
}