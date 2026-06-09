// types/problem.ts
export type Difficulty = "Easy" | "Medium" | "Hard";

export type Example = {
  input: string;
  output: string;
  explanation?: string;
};

export type TestCase = {
  id: string;
  input: string;
  expectedOutput: string;
};

export type Problem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: Example[];
  hints: string[];
  editorial: string;
  testCases: TestCase[];
};

export type TestCaseResult = {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  runtime?: string;
  memory?: string;
};

export type RunResult = {
  status: "success" | "error" | "tle" | "mle";
  results: TestCaseResult[];
  compilerError?: string;
  runtime?: string;
  memory?: string;
};

export type SubmitResult = {
  status: "accepted" | "wrong_answer" | "tle" | "mle" | "runtime_error" | "compile_error";
  passedCount: number;
  totalCount: number;
  runtime?: string;
  memory?: string;
  error?: string;
};
