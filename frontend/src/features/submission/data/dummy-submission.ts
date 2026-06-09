import type { Submission } from "@/types/submissions";

export const DUMMY_SUBMISSIONS: Submission[] = [
  {
    id: "sub_123",
    status: "Accepted",
    language: "cpp",
    runtime: "32ms",
    memory: "11MB",
    submittedAt: "2026-06-07T12:30:00Z",
    sourceCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.count(complement)) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    auto result = sol.twoSum(nums, target);
    cout << "[" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}`,
    testCases: [
      { name: "Case 1", status: "Passed", input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]", actualOutput: "[0,1]", runtime: "0ms" },
      { name: "Case 2", status: "Passed", input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]", actualOutput: "[1,2]", runtime: "0ms" },
      { name: "Case 3", status: "Passed", input: "nums = [3,3], target = 6", expectedOutput: "[0,1]", actualOutput: "[0,1]", runtime: "0ms" },
    ],
  },
  {
    id: "sub_122",
    status: "Wrong Answer",
    language: "python",
    runtime: "—",
    memory: "—",
    submittedAt: "2026-06-07T11:15:00Z",
    sourceCode: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []`,
    testCases: [
      { name: "Case 1", status: "Passed", input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]", actualOutput: "[0,1]", runtime: "1ms" },
      { name: "Case 2", status: "Failed", input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]", actualOutput: "[0,2]", runtime: "1ms" },
      { name: "Case 3", status: "Failed", input: "nums = [3,3], target = 6", expectedOutput: "[0,1]", actualOutput: "[]", runtime: "0ms" },
    ],
  },
  {
    id: "sub_121",
    status: "Time Limit Exceeded",
    language: "java",
    runtime: ">2000ms",
    memory: "52MB",
    submittedAt: "2026-06-06T18:45:00Z",
    sourceCode: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }
}`,
    testCases: [
      { name: "Case 1", status: "Passed", input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]", actualOutput: "[0,1]", runtime: "0ms" },
      { name: "Case 2", status: "Passed", input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]", actualOutput: "[1,2]", runtime: "0ms" },
      { name: "Case 3", status: "Failed", input: "Large input (10000 elements)", expectedOutput: "[4999,5000]", actualOutput: "TLE", runtime: ">2000ms" },
    ],
  },
  {
    id: "sub_120",
    status: "Runtime Error",
    language: "javascript",
    runtime: "—",
    memory: "—",
    submittedAt: "2026-06-05T09:00:00Z",
    sourceCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i <= nums.length; i++) { // Bug: <= instead of <
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
};`,
    testCases: [
      { name: "Case 1", status: "Failed", input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]", actualOutput: "TypeError: Cannot read properties of undefined", runtime: "—" },
    ],
  },
];

export function getSubmissionById(id: string): Submission | undefined {
  return DUMMY_SUBMISSIONS.find((s) => s.id === id);
}