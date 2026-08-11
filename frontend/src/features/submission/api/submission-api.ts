// features/submission/api/submission-api.ts
import type { SubmissionListItem, SubmissionDetail } from "@/types/submissions";
import { api } from "@/services/axios-interceptor";

export async function fetchSubmissionsForProblem(problemId: string | number) {
  const { data } = await api.get<SubmissionListItem[]>(
    `/submissions/problems/${problemId}`
  );
  return data;
}

export async function fetchSubmissionDetail(submissionId: string | number) {
  const { data } = await api.get<SubmissionDetail>(
    `/submissions/${submissionId}`
  );
  return data;
}