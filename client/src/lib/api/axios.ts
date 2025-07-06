import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Public instance for requests that don't need authentication
export const $axios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

$axios.interceptors.request.use(
  (config) => {
    // hech narsa qilmasdan, config'ni o'zini qaytaradi
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Private instance for requests that need authentication
export const $api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

$api.interceptors.request.use(
  (config) => {
    // So'rov yuborishdan oldin Zustand store'dan tokenni olamiz
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
$api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const { status } = error.response || {};

    // Faqat 401 xatolari uchun token refresh qilamiz
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("🔄 Token may be expired, attempting to refresh...");

        const { data } = await $axios.post("/auth/refresh");

        const { accessToken } = data.data;
        useAuthStore.getState().setAccessToken(accessToken);

        console.log("✅ Token successfully refreshed!");

        originalRequest.headers!.Authorization = `Bearer ${accessToken}`;

        console.log("🔄 Retrying original request...");
        return $api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);

        // Agar refresh ham xato bersa, logout qilamiz
        useAuthStore.getState().reset();

        // Modal ochish uchun event yuboramiz
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("showLoginModal"));
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
