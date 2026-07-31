import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't intercept the refresh endpoint itself
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          await api.post("/auth/refresh");
          isRefreshing = false;
        }

        return api(originalRequest);
      } catch (e) {
        isRefreshing = false;

        window.location.replace("/login");

        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);
