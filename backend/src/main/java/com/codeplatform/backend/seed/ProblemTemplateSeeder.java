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
@Profile("prod")
@Slf4j
@Order(8)
public class ProblemTemplateSeeder implements CommandLineRunner {

    private final ProblemTemplateRepository problemTemplateRepository;
    private final ProblemRepository problemRepository;
    private final LanguageRepository languageRepository;

    @Override
    public void run(String... args) {

        ProblemEntity twoSum = problemRepository.findBySlug("two-sum")
                .orElseThrow(() -> new IllegalStateException("Problem 'two-sum' not found"));

        List<TemplateSeed> templates = List.of(

                // ================= JAVA =================

                new TemplateSeed(
                        "Java",

                        """
                        class Solution {
                            public int[] twoSum(int[] nums, int target) {

                                // Write your code here

                                return new int[0];
                            }
                        }
                        """,

                        """
                        import java.util.*;

                        {{USER_CODE}}

                        public class Main {

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

                                int[] ans = solution.twoSum(nums, target);

                                for (int i = 0; i < ans.length; i++) {
                                    if (i > 0) System.out.print(" ");
                                    System.out.print(ans[i]);
                                }
                            }
                        }
                        """
                ),

                // ================= PYTHON =================

                new TemplateSeed(
                        "Python",

                        """
                        class Solution:
                            def twoSum(self, nums, target):
                                # Write your code here
                                return []
                        """,

                        """
                        {{USER_CODE}}

                        import sys

                        def main():

                            n = int(sys.stdin.readline())

                            nums = list(map(int, sys.stdin.readline().split()))

                            target = int(sys.stdin.readline())

                            solution = Solution()

                            ans = solution.twoSum(nums, target)

                            print(*ans)

                        if __name__ == "__main__":
                            main()
                        """
                ),

                // ================= C++ =================

                new TemplateSeed(
                        "Cpp",

                        """
                        class Solution {
                        public:
                            vector<int> twoSum(vector<int>& nums, int target) {

                                return {};

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

                            for(int i=0;i<n;i++)
                                cin >> nums[i];

                            int target;

                            cin >> target;

                            Solution solution;

                            vector<int> ans = solution.twoSum(nums,target);

                            for(int i=0;i<ans.size();i++){

                                if(i) cout<<" ";

                                cout<<ans[i];
                            }

                            return 0;
                        }
                        """
                ),

                // ================= JavaScript =================

                new TemplateSeed(
                        "JavaScript",

                        """
                        class Solution {

                            twoSum(nums, target) {

                            }

                        }
                        """,

                        """
                        {{USER_CODE}}

                        const fs = require('fs');

                        const input = fs.readFileSync(0, 'utf8').trim().split('\\n');

                        const n = Number(input[0]);

                        const nums = input[1].trim().split(/\\s+/).map(Number);

                        const target = Number(input[2]);

                        const solution = new Solution();

                        const ans = solution.twoSum(nums,target);

                        console.log(ans.join(" "));
                        """
                )
        );

        for (TemplateSeed seed : templates) {

            LanguageEntity language = languageRepository
                    .findByNameIgnoreCase(seed.languageName())
                    .orElseThrow(() -> new IllegalStateException(
                            "Language '" + seed.languageName() + "' not found"));

            if (problemTemplateRepository.existsByProblemIdAndLanguageId(twoSum.getId(), language.getId())) {
                continue;
            }

            problemTemplateRepository.save(
                    ProblemTemplateEntity.builder()
                            .problem(twoSum)
                            .language(language)
                            .starterCode(seed.starterCode())
                            .driverCode(seed.driverCode())
                            .build()
            );
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