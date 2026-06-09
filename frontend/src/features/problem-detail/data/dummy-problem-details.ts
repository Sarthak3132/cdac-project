import type { Problem, RunResult, SubmitResult } from "@/types/problem-detail";

export const DUMMY_PROBLEM: Problem = {
  id: "1",
  title: "Two Sum",
  difficulty: "Easy",
  tags: ["Array", "Hash Map"],
  statement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
  inputFormat: `The first line contains an integer n — the size of the array.
The second line contains n space-separated integers representing the array nums.
The third line contains an integer target.`,
  outputFormat: `Print two space-separated integers representing the indices of the two numbers that add up to target.`,
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
  examples: [
    {
      input: "4\n2 7 11 15\n9",
      output: "0 1",
      explanation: "nums[0] + nums[1] = 2 + 7 = 9, so we return [0, 1].",
    },
    {
      input: "3\n3 2 4\n6",
      output: "1 2",
      explanation: "nums[1] + nums[2] = 2 + 4 = 6, so we return [1, 2].",
    },
    {
      input: "2\n3 3\n6",
      output: "0 1",
    },
  ],
  hints: [
    "A brute force approach would be to check every pair of numbers. What is the time complexity of that?",
    "Can you trade space for time? Think about what data structure lets you look up values in O(1).",
    "For each number x, check if target - x already exists in a hash map before inserting x.",
  ],
  editorial: `**Approach: Hash Map (O(n) time, O(n) space)**

Iterate through the array once. For each element nums[i], compute complement = target - nums[i].
Check if complement exists in the hash map — if yes, return [map[complement], i].
Otherwise, store nums[i] → i in the map and continue.

This avoids the O(n²) brute force by reducing each lookup to O(1).

\`\`\`cpp
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) return {seen[comp], i};
        seen[nums[i]] = i;
    }
    return {};
}
\`\`\``,
  testCases: [
    { id: "tc1", input: "4\n2 7 11 15\n9", expectedOutput: "0 1" },
    { id: "tc2", input: "3\n3 2 4\n6", expectedOutput: "1 2" },
    { id: "tc3", input: "2\n3 3\n6", expectedOutput: "0 1" },
  ],
};

export const DUMMY_RUN_RESULT: RunResult = {
  status: "success",
  runtime: "12ms",
  memory: "38.4 MB",
  results: [
    {
      id: "tc1",
      input: "4\n2 7 11 15\n9",
      expectedOutput: "0 1",
      actualOutput: "0 1",
      passed: true,
      runtime: "12ms",
      memory: "38.4 MB",
    },
    {
      id: "tc2",
      input: "3\n3 2 4\n6",
      expectedOutput: "1 2",
      actualOutput: "1 2",
      passed: true,
      runtime: "10ms",
      memory: "37.9 MB",
    },
    {
      id: "tc3",
      input: "2\n3 3\n6",
      expectedOutput: "0 1",
      actualOutput: "2 0",
      passed: false,
      runtime: "11ms",
      memory: "38.1 MB",
    },
  ],
};

export const DUMMY_SUBMIT_RESULT: SubmitResult = {
  status: "accepted",
  passedCount: 42,
  totalCount: 42,
  runtime: "8ms",
  memory: "36.2 MB",
};
