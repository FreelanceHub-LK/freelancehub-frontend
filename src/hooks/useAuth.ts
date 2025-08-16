// hooks/useAuth.ts
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth({ required = false, redirectTo = "/login" } = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const isAuthenticated = !!session?.user;
  const isLoading = status === "loading";
  
  useEffect(() => {
    const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

    if (required && !isLoading && !isAuthenticated && (!accessToken || !refreshToken)) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, required, redirectTo, router]);
  
  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      return result;
    } catch (error) {
      console.error("Login error:", error);
      return { error: "Login failed" };
    }
  };
  
  const register = async (userData: any) => {
    try {
      return await login(userData.email, userData.password);
    } catch (error) {
      console.error("Registration error:", error);
      return { error: "Registration failed" };
    }
  };
  
  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }

    await signOut({ redirect: true, callbackUrl: redirectTo });
  };
  
  return {
    isAuthenticated,
    isLoading,
    session,
    login,
    register,
    logout,
  };
}