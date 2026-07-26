package com.codeplatform.backend.seed;

import com.codeplatform.backend.problem.ProblemEntity;
import com.codeplatform.backend.problem.ProblemRepository;
import com.codeplatform.backend.testcase.TestCaseEntity;
import com.codeplatform.backend.testcase.TestCaseRepository;
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
@Order(5)
public class TestCaseSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;

    @Override
    public void run(String... args) {
        // Must run after ProblemSeeder — looks problems up by slug to get their generated id.
        Map<String, List<TestCaseSeed>> testCasesBySlug = Map.of(
                "two-sum", List.of(
                        new TestCaseSeed("4\n2 7 11 15\n9", "0 1"),
                        new TestCaseSeed("3\n3 2 4\n6", "1 2"),
                        new TestCaseSeed("2\n3 3\n6", "0 1"),
                        new TestCaseSeed("5\n1 5 3 7 9\n10", "0 4"),
                        new TestCaseSeed("4\n-3 4 3 90\n0", "0 2")
                ),
                "valid-parentheses", List.of(
                        new TestCaseSeed("()[]{}", "true"),
                        new TestCaseSeed("(]", "false"),
                        new TestCaseSeed("([)]", "false"),
                        new TestCaseSeed("{[]}", "true"),
                        new TestCaseSeed("(((", "false")
                ),
                "longest-substring-without-repeating-characters", List.of(
                        new TestCaseSeed("abcabcbb", "3"),
                        new TestCaseSeed("bbbbb", "1"),
                        new TestCaseSeed("pwwkew", "3"),
                        new TestCaseSeed("", "0"),
                        new TestCaseSeed("dvdf", "3")
                )
        );

        for (Map.Entry<String, List<TestCaseSeed>> entry : testCasesBySlug.entrySet()) {
            ProblemEntity problem = problemRepository.findBySlug(entry.getKey())
                    .orElseThrow(() -> new IllegalStateException("Expected seeded problem '" + entry.getKey() + "' to exist"));

            if (!testCaseRepository.findByProblemId(problem.getId()).isEmpty()) {
                continue;
            }

            for (TestCaseSeed testCase : entry.getValue()) {
                testCaseRepository.save(
                        TestCaseEntity.builder()
                                .problem(problem)
                                .inputData(testCase.input())
                                .expectedOutput(testCase.output())
                                .build()
                );
            }
        }

        log.info("Test cases seeded successfully.");
    }

    private record TestCaseSeed(String input, String output) {
    }
}