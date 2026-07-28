export interface Language {
  id: number;

  name: string;
  version: string;

  dockerImage: string;
  sourceFile: string;

  compileCommand: string | null;
  runCommand: string;

  isCompiled: boolean;
  enabled: boolean;
}