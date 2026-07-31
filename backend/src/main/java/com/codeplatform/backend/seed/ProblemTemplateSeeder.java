package com.codeplatform.backend.seed;
import com.codeplatform.backend.language.LanguageEntity;
import com.codeplatform.backend.language.LanguageRepository;
import com.codeplatform.backend.problem.ProblemEntity;
import com.codeplatform.backend.problem.ProblemRepository;
import com.codeplatform.backend.problemtemplate.ProblemTemplateEntity;
import com.codeplatform.backend.problemtemplate.ProblemTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import java.util.List;
@Component
@RequiredArgsConstructor
@Profile("dev")
@Slf4j
@Order(8)
public class ProblemTemplateSeeder implements CommandLineRunner {
    private final ProblemTemplateRepository problemTemplateRepository;
    private final ProblemRepository problemRepository;
    private final LanguageRepository languageRepository;
    @Override
    public void run(String... args) {
        // Must run after ProblemSeeder and LanguageSeeder.
        ProblemEntity twoSum = problemRepository.findBySlug("two-sum")
                .orElseThrow(() -> new IllegalStateException("Expected seeded problem 'two-sum' to exist"));

        List<TemplateSeed> templates = List.of(
                new TemplateSeed(
                        "Java",
                        """
                        class Solution {
                            public int[] twoSum(int[] nums, int target) {
                                // write your code here
                            }
                        }
                        """,
                        """
                        import java.util.*;

                        public class Main {
                            {{USER_CODE}}

                            public static void main(String[] args) {
                                Scanner scanner = new Scanner(System.in);
                                int n = Integer.parseInt(scanner.nextLine().trim());
                                int[] nums = new int[n];
                                StringTokenizer st = new StringTokenizer(scanner.nextLine());
                                for (int i = 0; i < n; i++) {
                                    nums[i] = Integer.parseInt(st.nextToken());
                                }
                                int target = Integer.parseInt(scanner.nextLine().trim());

                                Solution solution = new Solution();
                                int[] result = solution.twoSum(nums, target);

                                StringBuilder sb = new StringBuilder();
                                for (int i = 0; i < result.length; i++) {
                                    sb.append(result[i]);
                                    if (i != result.length - 1) sb.append(" ");
                                }
                                System.out.println(sb.toString());
                            }
                        }
                        """
                ),
                new TemplateSeed(
                        "Python",
                        """
                        class Solution:
                            def twoSum(self, nums, target):
                                # write your code here
                                pass
                        """,
                        """
                        {{USER_CODE}}

                        import sys

                        def main():
                            data = sys.stdin.read().split('\\n')
                            n = int(data[0].strip())
                            nums = list(map(int, data[1].split()))
                            target = int(data[2].strip())

                            solution = Solution()
                            result = solution.twoSum(nums, target)
                            print(' '.join(map(str, result)))

                        if __name__ == "__main__":
                            main()
                        """
                ),
                new TemplateSeed(
                        "Cpp",
                        """
                        class Solution {
                        public:
                            vector<int> twoSum(vector<int>& nums, int target) {
                                // write your code here
                            }
                        };
                        """,
                        """
                        #include <bits/stdc++.h>
                        using namespace std;

                        {{USER_CODE}}

                        int main() {
                            int n;
                            cin >> n;
                            vector<int> nums(n);
                            for (int i = 0; i < n; i++) cin >> nums[i];
                            int target;
                            cin >> target;

                            Solution solution;
                            vector<int> result = solution.twoSum(nums, target);

                            for (size_t i = 0; i < result.size(); i++) {
                                cout << result[i];
                                if (i != result.size() - 1) cout << " ";
                            }
                            cout << endl;
                            return 0;
                        }
                        """
                ),
                new TemplateSeed(
                        "JavaScript",
                        """
                        class Solution {
                            twoSum(nums, target) {
                                // write your code here
                            }
                        }
                        """,
                        """
                        {{USER_CODE}}

                        const readline = require('readline');
                        const rl = readline.createInterface({ input: process.stdin });

                        let lines = [];
                        rl.on('line', (line) => lines.push(line));
                        rl.on('close', () => {
                            const n = parseInt(lines[0].trim());
                            const nums = lines[1].trim().split(/\\s+/).map(Number);
                            const target = parseInt(lines[2].trim());

                            const solution = new Solution();
                            const result = solution.twoSum(nums, target);

                            console.log(result.join(' '));
                        });
                        """
                )
        );

        for (TemplateSeed seed : templates) {
            LanguageEntity language = languageRepository.findByNameIgnoreCase(seed.languageName())
                    .orElseThrow(() -> new IllegalStateException("Expected seeded language '" + seed.languageName() + "' to exist"));

            if (problemTemplateRepository.existsByProblemIdAndLanguageId(twoSum.getId(), language.getId())) {
                continue;
            }

            ProblemTemplateEntity template = ProblemTemplateEntity.builder()
                    .problem(twoSum)
                    .language(language)
                    .starterCode(seed.starterCode())
                    .driverCode(seed.driverCode())
                    .build();
            problemTemplateRepository.save(template);
        }

        log.info("Problem templates seeded successfully.");
    }

    private record TemplateSeed(
            String languageName,
            String starterCode,
            String driverCode
    ) {
    }
}
