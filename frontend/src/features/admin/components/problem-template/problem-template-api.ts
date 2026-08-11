import { api } from "@/services/axios-interceptor";
import type {
  ApiEnvelope,
  CreateProblemTemplatePayload,
  LanguageOption,
  ProblemTemplateDetails,
  ProblemTemplateSummary,
  UpdateProblemTemplatePayload,
} from "@/types/problem-template";

const BASE = "/problem-templates";

export async function getTemplatesByProblem(problemId: string): Promise<ProblemTemplateSummary[]> {
  const res = await api.get<ApiEnvelope<ProblemTemplateSummary[]>>(`${BASE}/problem/${problemId}`);
  return res.data.data;
}

export async function getTemplateById(id: number): Promise<ProblemTemplateDetails> {
  const res = await api.get<ApiEnvelope<ProblemTemplateDetails>>(`${BASE}/${id}`);
  return res.data.data;
}

export async function createTemplate(
  payload: CreateProblemTemplatePayload,
): Promise<ProblemTemplateSummary> {
  const res = await api.post<ApiEnvelope<ProblemTemplateSummary>>(BASE, payload);
  return res.data.data;
}

export async function updateTemplate(
  id: number,
  payload: UpdateProblemTemplatePayload,
): Promise<ProblemTemplateSummary> {
  const res = await api.put<ApiEnvelope<ProblemTemplateSummary>>(`${BASE}/${id}`, payload);
  return res.data.data;
}

export async function deleteTemplate(id: number): Promise<void> {
  await api.delete<ApiEnvelope<void>>(`${BASE}/${id}`);
}

export async function getLanguages(): Promise<LanguageOption[]> {
  const res = await api.get<ApiEnvelope<LanguageOption[]>>("/languages");
  return res.data.data;
}
