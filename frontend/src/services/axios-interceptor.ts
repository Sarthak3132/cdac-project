import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let refreshPromise: Promise<any> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";

    // Never try to refresh login/register/refresh requests
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api.post("/auth/refresh");
      }

      await refreshPromise;
      refreshPromise = null;

      // Retry the original request
      return api(originalRequest);
    } catch (err) {
      refreshPromise = null;

      // Let the caller (ProtectedRoutes) handle redirecting
      return Promise.reject(err);
    }
  },
);
