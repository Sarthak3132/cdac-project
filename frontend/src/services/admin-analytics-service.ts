import { api } from "./axios-interceptor";
import type { AdminAnalyticsDto, ApiResponse } from "@/types/admin-analytics";

export async function getAnalytics(): Promise<AdminAnalyticsDto> {
  const response = await api.get<ApiResponse<AdminAnalyticsDto>>("/admin/analytics");
  return response.data.data;
}