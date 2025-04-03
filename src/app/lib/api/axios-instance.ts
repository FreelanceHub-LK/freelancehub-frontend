import { toast } from "@/context/toast-context";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error("Bad Request: Invalid data submitted");
          break;
        case 401:
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const refreshToken = localStorage.getItem("refresh_token");
              const response = await axios.post("/auth/refresh", {
                refreshToken,
              });

              const data = response.data as { accessToken: string; refreshToken: string };
              localStorage.setItem("access_token", data.accessToken);
              localStorage.setItem("refresh_token", data.refreshToken);
              return apiClient(originalRequest);
            } catch (refreshError) {
              toast.error("Session expired. Please login again.");
              return Promise.reject(refreshError);
            }
          }
          break;
        case 403:
          toast.error("You do not have permission to perform this action");
          break;
        case 404:
          toast.error("Requested resource not found");
          break;
        case 500:
          toast.error("Internal Server Error. Please try again later.");
          break;
        default:
          toast.error("An unexpected error occurred");
      }
    } else if (error.request) {
      toast.error(
        "No response received from server. Check your network connection.",
      );
    } else {
      toast.error("Error setting up the request");
    }

    return Promise.reject(error);
  },
);

export const apiService = {
  get: (url: string, config = {}) => apiClient.get(url, config),
  post: (url: string, data = {}, config = {}) =>
    apiClient.post(url, data, config),
  put: (url: string, data = {}, config = {}) =>
    apiClient.put(url, data, config),
  patch: (url: string, data = {}, config = {}) =>
    apiClient.patch(url, data, config),
  delete: (url: string, config = {}) => apiClient.delete(url, config),
};

export default apiClient;
