import { toast } from "../context/toast-context";
import { handleApiError } from "../lib/config/apiConfig";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  timeout: 15000, // Increased timeout for better performance
  headers: {
    "Content-Type": "application/json",
  },
  // Performance optimizations
  withCredentials: true, // Enable credentials for session support (needed for passkey)
  validateStatus: (status) => status < 500, // Only reject 5xx errors
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    
    // Debug logging for passkey endpoints
    if (config.url?.includes('/auth/passkeys/')) {
      console.log('Passkey API request interceptor:');
      console.log('- URL:', config.url);
      console.log('- Token exists:', !!token);
      console.log('- Token length:', token ? token.length : 0);
      console.log('- Method:', config.method);
    }
    
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
      const status = error.response.status;
      const errorMessage = handleApiError(error);
      
      switch (status) {
        case 400:
          toast.error(errorMessage);
          break;
        case 401:
          // Debug logging for passkey endpoints
          if (originalRequest.url?.includes('/auth/passkeys/')) {
            console.log('401 error on passkey endpoint:');
            console.log('- URL:', originalRequest.url);
            console.log('- Response:', error.response?.data);
            console.log('- Has retry flag:', !!originalRequest._retry);
          }
          
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const refreshToken = localStorage.getItem("refresh_token");
              if (refreshToken) {
                const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
                  refreshToken,
                });

                const data = response.data as { accessToken: string; refreshToken: string };
                localStorage.setItem("access_token", data.accessToken);
                localStorage.setItem("refresh_token", data.refreshToken);
                
                // Update the original request with new token
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return apiClient(originalRequest);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              toast.error("Session expired. Please login again.");
              // Redirect to login page
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
              return Promise.reject(refreshError);
            }
          } else {
            toast.error(errorMessage);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
          break;
        case 403:
          toast.error(errorMessage);
          break;
        case 404:
          // Don't show toast for 404s, let components handle them
          break;
        case 500:
          toast.error(errorMessage);
          break;
        default:
          toast.error(errorMessage);
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred.");
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
