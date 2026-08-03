// features/admin/components/problem-example/types.ts
export interface ProblemExample {
  id: number;
  inputData: string;
  outputData: string;
  explanation?: string | null;
  displayOrder: number;
}