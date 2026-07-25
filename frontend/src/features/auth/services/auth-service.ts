import { api } from "@/services/axios-interceptor"
import type { User } from "@/types/auth"

export const authService = {
  async login(email: string, password: string): Promise<void> {
    await api.post("/auth/login", { email, password })
  },

  async register(userName: string, email: string, password: string): Promise<void> {
    await api.post("/auth/register", { userName, email, password })
  },

  async getMe(): Promise<User> {
    const response = await api.get<{ data: User }>("/auth/me")
    return response.data.data
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout")
  },
}