export type Language = {
  id: number;
  name: string;
  version: string;
  shortName: string;
  fileExtension: string;
  judge0LanguageId: number;
};

export interface CompilerState {
  selectedLanguage: string | null;
  codeByLanguage: Record<string, string>;
}
