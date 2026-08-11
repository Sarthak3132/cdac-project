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
@Profile("prod")
@Slf4j
@Order(5)
public class TestCaseSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;

    @Override
    public void run(String... args) {

        Map<String, List<TestCaseSeed>> testCasesBySlug = Map.of(

                "two-sum", List.of(
                        new TestCaseSeed(
                                "4\n2 7 11 15\n9",
                                "nums = [2, 7, 11, 15]\ntarget = 9",
                                "0 1",
                                "Because nums[0] + nums[1] = 9.",
                                true
                        ),
                        new TestCaseSeed(
                                "3\n3 2 4\n6",
                                "nums = [3, 2, 4]\ntarget = 6",
                                "1 2",
                                "Because nums[1] + nums[2] = 6.",
                                true
                        ),
                        new TestCaseSeed(
                                "2\n3 3\n6",
                                null,
                                "0 1",
                                null,
                                false
                        ),
                        new TestCaseSeed(
                                "5\n1 5 3 7 9\n10",
                                null,
                                "0 4",
                                null,
                                false
                        ),
                        new TestCaseSeed(
                                "4\n-3 4 3 90\n0",
                                null,
                                "0 2",
                                null,
                                false
                        )
                ),

                "valid-parentheses", List.of(
                        new TestCaseSeed(
                                "()[]{}",
                                "s = \"()[]{}\"",
                                "true",
                                "Every opening bracket has a matching closing bracket.",
                                true
                        ),
                        new TestCaseSeed(
                                "(]",
                                "s = \"(]\"",
                                "false",
                                "The brackets do not match.",
                                true
                        ),
                        new TestCaseSeed("([)]", null, "false", null, false),
                        new TestCaseSeed("{[]}", null, "true", null, false),
                        new TestCaseSeed("(((", null, "false", null, false)
                ),

                "longest-substring-without-repeating-characters", List.of(
                        new TestCaseSeed(
                                "abcabcbb",
                                "s = \"abcabcbb\"",
                                "3",
                                "The longest substring is \"abc\".",
                                true
                        ),
                        new TestCaseSeed(
                                "bbbbb",
                                "s = \"bbbbb\"",
                                "1",
                                "The longest substring is \"b\".",
                                true
                        ),
                        new TestCaseSeed("pwwkew", null, "3", null, false),
                        new TestCaseSeed("", null, "0", null, false),
                        new TestCaseSeed("dvdf", null, "3", null, false)
                )
        );

        for (Map.Entry<String, List<TestCaseSeed>> entry : testCasesBySlug.entrySet()) {

            ProblemEntity problem = problemRepository.findBySlug(entry.getKey())
                    .orElseThrow(() ->
                            new IllegalStateException(
                                    "Expected seeded problem '" + entry.getKey() + "' to exist"
                            ));

            if (!testCaseRepository.findByProblemId(problem.getId()).isEmpty()) {
                continue;
            }

            List<TestCaseEntity> entities = entry.getValue().stream()
                    .map(seed -> TestCaseEntity.builder()
                            .problem(problem)
                            .inputData(seed.input())
                            .displayInput(seed.displayInput())
                            .expectedOutput(seed.output())
                            .explanation(seed.explanation())
                            .visible(seed.visible())
                            .build())
                    .toList();

            testCaseRepository.saveAll(entities);
        }

        log.info("Test cases seeded successfully.");
    }

    private record TestCaseSeed(
            String input,
            String displayInput,
            String output,
            String explanation,
            Boolean visible
    ) {
    }
}