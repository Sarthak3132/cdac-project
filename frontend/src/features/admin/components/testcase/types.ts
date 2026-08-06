export interface TestCase {
  id: number;
  inputData: string;
  displayInput: string | null;
  expectedOutput: string;
  explanation: string | null;
}