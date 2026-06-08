export type SubmissionStatus =
  | "Accepted"
  | "Wrong Answer"
  | "Time Limit Exceeded"
  | "Runtime Error"
  | "Compilation Error"
  | "Memory Limit Exceeded";

export interface TestCase {
  name: string;
  status: "Passed" | "Failed";
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  runtime?: string;
}

export interface Submission {
  id: string;
  status: SubmissionStatus;
  language: string;
  runtime: string;
  memory: string;
  submittedAt: string;
  sourceCode: string;
  testCases: TestCase[];
}