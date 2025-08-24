"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api/axios-instance";

interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "freelancer" | "admin";
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Verify token is still valid by making a test request
        try {
          const profile = await apiService.get("/auth/me");
          const profileData = profile.data as any;
          
          // Update user data if the profile has newer information
          if (profileData && profileData.id === parsedUser.id) {
            const updatedUser = {
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: profileData.role,
              profilePicture: profileData.profilePicture,
            };
            
            // Only update if there are actual changes
            if (JSON.stringify(updatedUser) !== JSON.stringify(parsedUser)) {
              localStorage.setItem("user", JSON.stringify(updatedUser));
              setUser(updatedUser);
            }
          }
        } catch (profileError) {
          // If token is invalid, clear auth data
          console.warn("Invalid token detected, clearing auth data");
          logout();
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.post("/auth/login", {
        email,
        password,
      });

      const authResponse = response.data as any;

      // Store tokens and user data
      storeAuthData(authResponse);

      // Redirect based on role and profile completion
      if (authResponse.role === "freelancer") {
        try {
          // Check if freelancer profile exists
          await apiService.get("/freelancers/me");
          router.push("/dashboard");
        } catch (profileError: any) {
          if (profileError.response?.status === 404) {
            // No freelancer profile found, redirect to setup
            router.push("/freelancer/setup");
          } else {
            // Other error, go to dashboard anyway
            router.push("/dashboard");
          }
        }
      } else if (authResponse.role === "client") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (authResponse: any) => {
    try {
      // Store tokens and user data after successful registration
      storeAuthData(authResponse);
    } catch (error) {
      throw error;
    }
  };

  const storeAuthData = (authResponse: any) => {
    // Clear any existing auth data first to ensure clean override
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    // Store new tokens
    localStorage.setItem("access_token", authResponse.accessToken);
    if (authResponse.refreshToken) {
      localStorage.setItem("refresh_token", authResponse.refreshToken);
    }
    
    const userData = {
      id: authResponse.id,
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role,
      profilePicture: authResponse.profilePicture,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.get("/auth/me");
      const userData = response.data as User;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error refreshing user:", error);
      logout();
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
