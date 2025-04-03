import { toast } from "@/context/toast-context";
import axios from "axios";

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle specific error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error("Bad Request: Invalid data submitted");
          break;
        case 401:
          // Unauthorized - handle token refresh or redirect to login
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const refreshToken = localStorage.getItem("refresh_token");
              const response = await axios.post("/auth/refresh", {
                refreshToken,
              });

              // Update tokens
              localStorage.setItem("access_token", response.data.accessToken);
              localStorage.setItem("refresh_token", response.data.refreshToken);

              // Retry the original request
              return apiClient(originalRequest);
            } catch (refreshError) {
              // Logout user if refresh fails
              toast.error("Session expired. Please login again.");
              // Implement logout logic here
              // window.location.href = '/login';
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
      // Network error or request never left
      toast.error(
        "No response received from server. Check your network connection.",
      );
    } else {
      // Something happened in setting up the request
      toast.error("Error setting up the request");
    }

    return Promise.reject(error);
  },
);

// API service methods
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
