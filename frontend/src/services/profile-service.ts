import { api } from "./axios-interceptor";
import type { UserProfile } from "@/types/profile";

type ApiResponse<T> = {
  message: string;
  data: T;
};

export async function getCurrentUserProfile() {
  const response = await api.get<ApiResponse<UserProfile>>("/users/");
  return response.data.data;
}

export async function updateUserProfile(data: {
  username?: string;
  bio?: string;
  profileImageUrl?: string;
}) {
  const response = await api.put<ApiResponse<UserProfile>>("/users/me", data);
  return response.data.data;
}