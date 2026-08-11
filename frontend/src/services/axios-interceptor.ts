import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    if (!request) {
      return Promise.reject(error);
    }

    const url = request.url || "";

    // Don't refresh auth requests
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    // Only handle 401
    if (error.response?.status !== 401 || request._retry) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api.post("/auth/refresh").then(() => {});
      }

      await refreshPromise;

      return api(request);
    } catch (err) {
      return Promise.reject(err);
    } finally {
      refreshPromise = null;
    }
  },
);
