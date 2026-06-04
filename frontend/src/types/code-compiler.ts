export type Language = {
  id: string;
  label: string;
  monacoId: string;
  defaultCode: string;
};

export interface CompilerState {
  selectedLanguage: string;
  codeByLanguage: Record<string, string>;
}

