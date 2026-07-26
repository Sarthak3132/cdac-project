package com.codeplatform.backend.seed;

import com.codeplatform.backend.problem.ProblemEntity;
import com.codeplatform.backend.problem.ProblemRepository;
import com.codeplatform.backend.problemexample.ProblemExampleEntity;
import com.codeplatform.backend.problemexample.ProblemExampleRepository;
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
@Order(4)
public class ProblemExampleSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;
    private final ProblemExampleRepository problemExampleRepository;

    @Override
    public void run(String... args) {
        // Must run after ProblemSeeder — looks problems up by slug to get their generated id.
        Map<String, List<ExampleSeed>> examplesBySlug = Map.of(
                "two-sum", List.of(
                        new ExampleSeed("nums = [2,7,11,15], target = 9", "[0,1]", "nums[0] + nums[1] == 9, so return [0, 1].", 1),
                        new ExampleSeed("nums = [3,2,4], target = 6", "[1,2]", "nums[1] + nums[2] == 6, so return [1, 2].", 2)
                ),
                "valid-parentheses", List.of(
                        new ExampleSeed("s = \"()[]{}\"", "true", "Every opening bracket has a matching closing bracket in the correct order.", 1),
                        new ExampleSeed("s = \"(]\"", "false", "The brackets do not match.", 2)
                ),
                "longest-substring-without-repeating-characters", List.of(
                        new ExampleSeed("s = \"abcabcbb\"", "3", "The answer is \"abc\", with the length of 3.", 1),
                        new ExampleSeed("s = \"bbbbb\"", "1", "The answer is \"b\", with the length of 1.", 2)
                )
        );

        for (Map.Entry<String, List<ExampleSeed>> entry : examplesBySlug.entrySet()) {
            ProblemEntity problem = problemRepository.findBySlug(entry.getKey())
                    .orElseThrow(() -> new IllegalStateException("Expected seeded problem '" + entry.getKey() + "' to exist"));

            if (!problemExampleRepository.findByProblemIdOrderByDisplayOrderAsc(problem.getId()).isEmpty()) {
                continue;
            }

            for (ExampleSeed example : entry.getValue()) {
                problemExampleRepository.save(
                        ProblemExampleEntity.builder()
                                .problem(problem)
                                .inputData(example.input())
                                .outputData(example.output())
                                .explanation(example.explanation())
                                .displayOrder(example.order())
                                .build()
                );
            }
        }

        log.info("Problem examples seeded successfully.");
    }

    private record ExampleSeed(String input, String output, String explanation, int order) {
    }
}