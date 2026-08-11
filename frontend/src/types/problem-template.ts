// src/features/problem-template/types.ts

export interface LanguageOption {
  id: number;
  name: string;
  shortName: string;
  fileExtension: string;
  version: string;
  judge0LanguageId: number;
  enabled: boolean;
}

export interface ProblemTemplateSummary {
  id: number;
  problemId: number;
  problemTitle: string;
  languageId: number;
  languageName: string;
  starterCode: string;
}

export interface ProblemTemplateDetails extends ProblemTemplateSummary {
  driverCode: string;
}

export interface CreateProblemTemplatePayload {
  problemId: string;
  languageId: number;
  starterCode: string;
  driverCode: string;
}

export interface UpdateProblemTemplatePayload {
  starterCode?: string;
  driverCode?: string;
}

export interface ApiEnvelope<T> {
  message: string;
  data: T;
}
