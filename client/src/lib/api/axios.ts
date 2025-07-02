import axios from "axios";
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
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
