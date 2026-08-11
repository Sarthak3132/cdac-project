export type SubmissionVerdict =
  | "PENDING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR"
  | "MEMORY_LIMIT_EXCEEDED";

export type SubmissionStatus =
  | "Accepted"
  | "Wrong Answer"
  | "Time Limit Exceeded"
  | "Runtime Error"
  | "Compilation Error"
  | "Memory Limit Exceeded";

export const VERDICT_TO_STATUS: Record<Exclude<SubmissionVerdict, "PENDING">, SubmissionStatus> = {
  ACCEPTED: "Accepted",
  WRONG_ANSWER: "Wrong Answer",
  TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
  RUNTIME_ERROR: "Runtime Error",
  COMPILATION_ERROR: "Compilation Error",
  MEMORY_LIMIT_EXCEEDED: "Memory Limit Exceeded",
};

export interface SubmissionListItem {
  id: number;
  verdict: SubmissionVerdict;
  language: string;
  cpuTimeMs: number | null;
  memoryUsageKb: number | null;
  passedTestcases: number | null;
  totalTestcases: number;
  submittedAt: string;
}

export interface SubmissionDetail {
  id: number;
  verdict: SubmissionVerdict;
  language: string;
  cpuTimeMs: number | null;
  memoryUsageKb: number | null;
  codeBody: string;
  totalTestcases: number;
  passedTestcases: number | null;
  failureInput: string | null;
  expectedOutput: string | null;
  actualOutput: string | null;
  diagnosticMessage: string | null;
  submittedAt: string;
}