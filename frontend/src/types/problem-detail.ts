// types/problem.ts
export type Difficulty = "Easy" | "Medium" | "Hard";

export type Language = {
  id: number;
  name: string;
  version: string;
};

export type TagResponse = {
  id: number;
  name: string;
};

export type ProblemHints = {
  id: number;
  content: string;
  displayOrder: number;
};

export interface ProblemDetails {
  id: number;
  title: string;
  slug: string;
  description: string;
  problemDifficulty: "EASY" | "MEDIUM" | "HARD";
  timeLimitMs: number;
  memoryLimitKb: number;
  isPublished: boolean;
  tags: TagResponse[];
  createdAt: string;
  updatedAt: string;
  testCases: any[];
}

export type TestCaseResult = {
  id: string;
  inputData: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  runtime?: string;
  memory?: string;
};

export type TestCase = {
  id: number;
  inputData: string;
  displayInput: string;
  expectedOutput: string;
  explanation?: string;
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
export type ProblemTemplate = {
  id: number;
  problemId: number;
  problemTitle: string;
  languageId: number;
  languageName: string;
  starterCode: string;
};
